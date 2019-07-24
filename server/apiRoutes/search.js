import Promise from 'bluebird';
import AWS from 'aws-sdk';
import elasticsearch from 'elasticsearch';

import { Organization } from '../models';
import app from '../server';
import { operators } from '../utilities';

AWS.config.update({ region: process.env.AWS_REGION });

const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

const client = new elasticsearch.Client({
	host: process.env.ELASTIC_URL,
});

const operatorSet = new Set(operators);

const getOrganizationBySlug = (slug) => Organization.findOne({ where: { slug: slug } });

const spanQueries = ['span_term', 'span_multi', 'span_near', 'span_or'];

app.post('/api/search', (req, res) => {
	const { query, operator, offset, fileType, source } = req.body;
	if (query && operatorSet.has(operator)) {
		lambda.invoke(
			{
				FunctionName: 'queryParser',
				Payload: JSON.stringify({ query: query.toLowerCase(), operator: operator }),
			},
			(err, data) => {
				new Promise(async function(resolve, reject) {
					if (data && data.StatusCode === 200) {
						const payload = JSON.parse(JSON.parse(data.Payload));
						if (fileType.length || source.length) {
							if (!payload.query.bool.filter) payload.query.bool.filter = [];
							if (fileType.length) {
								payload.query.bool.filter.push({
									terms: { contentType: fileType },
								});
							}
							if (source.length) {
								const orgs = await Promise.all(
									source.map(getOrganizationBySlug),
								).catch(reject);
								if (!orgs) return;
								payload.query.bool.filter.push({
									terms: { organizationId: orgs.map((org) => org.id) },
								});
							}
						}

						// We need to write a new query parser ASAP.
						if (Array.isArray(payload.query.bool.must)) {
							payload.query.bool.must.forEach((term, i) => {
								spanQueries.forEach((span) => {
									if (term[span] && typeof term[span] === 'object') {
										if (Array.isArray(term[span].clauses)) {
											term[span].clauses.forEach((clause, j) => {
												if (typeof clause.term === 'object') {
													payload.query.bool.must[i][span].clauses[
														j
													].span_term = clause.term;
													delete payload.query.bool.must[i][span].clauses[
														j
													].term;
												}
											});
										}
									}
								});
							});
						}

						const response = await client
							.search({
								index: process.env.ELASTIC_INDEX,
								body: {
									_source: { excludes: 'text' },
									from: offset || 0,
									size: 10,
									highlight: { fields: { text: {} } },
									aggs: {
										source: { terms: { field: 'organizationId' } },
										fileType: { terms: { field: 'contentType' } },
										// dateRange: {
										// 	auto_date_histogram: {
										// 		field: 'publicationDate',
										// 		buckets: 5,
										// 	},
										// },
									},
									// sort: { [req.body.sort]: 'asc' },
									...payload,
								},
							})
							.catch(reject);
						if (!response) return;

						if (response.timed_out) res.status(504).end('Timed out.');
						else {
							// There will probably be several results with the same organizationId;
							// instead of looking them all we'll make a map of ids to names ourselves.
							// This might be unnecessary if sequelize caches id lookups?
							const names = {};
							const hits = await Promise.all(
								response.hits.hits.map((hit) => {
									const { _id: id, _score: score, highlight } = hit;
									const {
										_source: { organizationId, ...rest },
									} = hit;
									if (names[organizationId] === undefined) {
										names[organizationId] = Organization.findByPk(
											organizationId,
										);
									}
									return names[organizationId].then((org) => ({
										id: id,
										score: score,
										sourceSlug: org ? org.slug : null,
										sourceName: org ? org.name : null,
										highlight: highlight,
										...rest,
									}));
								}),
							).catch(reject);
							if (!hits) return;

							const {
								source: { buckets, ...rest },
							} = response.aggregations;
							const namedBuckets = await Promise.all(
								buckets.map((item) => {
									const { key, doc_count: count } = item;
									if (names[key] === undefined) {
										names[key] = Organization.findByPk(key);
									}
									return names[key].then((org) => ({
										name: org ? org.name : null,
										slug: org ? org.slug : null,
										count: count,
									}));
								}),
							).catch(reject);
							if (!namedBuckets) return;

							resolve({
								query: query,
								operator: operator,
								aggregations: {
									// dateRange: response.aggregations.dateRange,
									fileType: response.aggregations.fileType,
									source: { buckets: namedBuckets, ...rest },
								},
								total: response.hits.total,
								max_score: response.hits.max_score,
								hits: hits,
							});
						}
					} else {
						reject(err);
					}
				})
					.then((result) => res.status(200).json(result))
					.catch((error) => res.status(400).json(error.toString()));
			},
		);
	} else {
		res.status(400).json('Invalid query or operator parameters');
	}
});
