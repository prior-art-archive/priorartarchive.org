import Promise from 'bluebird';
import AWS from 'aws-sdk';
import elasticsearch from 'elasticsearch';

import { Organization } from '../models';
import app from '../server';
import { operators } from '../utilities';

AWS.config.update({ region: process.env.AWS_REGION });

const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

const client = new elasticsearch.Client({
	host: process.env.ELASTIC_URL
});

const operatorSet = new Set(operators);

const getOrganizationBySlug = slug => Organization.findOne({ where: { slug } });

app.post('/api/search', (req, res)=> {
	const { query, operator, offset, fileType, source } = req.body;
	if (query && operatorSet.has(operator)) {
		query = query.toLowerCase();       // keep this variable name
		lambda.invoke({
			FunctionName: 'queryParser',
			Payload: JSON.stringify({ query, operator })
		}, async (err, data) => {
			if (data && data.StatusCode === 200) {
				const payload = JSON.parse(JSON.parse(data.Payload));
				if (fileType.length || source.length) {
					if (!payload.query.bool.filter) payload.query.bool.filter = [];
					if (fileType.length) {
						payload.query.bool.filter.push({
							terms: { contentType: fileType }
						});
					}
					if (source.length) {
						const orgs = await Promise.all(source.map(getOrganizationBySlug));
						payload.query.bool.filter.push({
							terms: { organizationId: orgs.map(org => org.id) }
						});
					}
				}

				const response = await client.search({
					index: process.env.ELASTIC_INDEX,
					body: {
						_source: { excludes: 'text' },
						from: offset || 0,
						size: 10,
						highlight: { fields: { text: { } } },
						aggs: {
							source: { terms: { field: 'organizationId' } },
							fileType: { terms: { field: 'contentType' } },
							dateRange: {
								auto_date_histogram: {
									field: 'publicationDate',
									buckets: 5
								}
							}
						},
						// sort: { [req.body.sort]: 'asc' },
						...payload
					}
				});

				if (response.timed_out) res.status(504).end('Timed out.');
				else {
					// There will probably be several results with the same organizationId;
					// instead of looking them all we'll make a map of ids to names ourselves.
					// This might be unnecessary if sequelize caches id lookups?
					const names = {};
					const hits = await Promise.all(response.hits.hits.map(hit => {
						const { _id: id, _score: score, highlight } = hit;
						const { organizationId, ...rest } = hit._source;
						if (names[organizationId] === undefined) {
							names[organizationId] = Organization.findByPk(organizationId);
						}
						return names[organizationId].then(org => ({
							id,
							score,
							sourceSlug: org.slug,
							sourceName: org.name,
							highlight,
							...rest
						}));
					}));

					const { source: { buckets, ...rest } } = response.aggregations;
					const namedBuckets = await Promise.all(buckets.map(item => {
						const { key, doc_count: count } = item;
						if (names[key] === undefined) names[key] = Organization.findByPk(key);
						return names[key].then(org => ({ name: org.name, slug: org.slug, count }));
					}));

					res.status(200).json({
						query: query,
						operator: operator,
						aggregations: {
							dateRange: response.aggregations.dateRange,
							fileType: response.aggregations.fileType,
							source: { buckets: namedBuckets, ...rest }
						},
						total: response.hits.total,
						max_score: response.hits.max_score,
						hits
					});
				}
			} else {
				res.status(400).json(err);
			}
		});
	} else {
		res.status(400).json('Invalid query or operator parameters');
	}
});
