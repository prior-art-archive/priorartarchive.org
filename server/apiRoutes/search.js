import Promise from 'bluebird';
import AWS from 'aws-sdk';
import elasticsearch from 'elasticsearch';

import { Organization } from '../models';
import app from '../server';

AWS.config.update({ region: process.env.AWS_REGION });

const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

const client = new elasticsearch.Client({
	host: process.env.ELASTIC_URL
});

const operators = new Set(['AND', 'OR', 'ADJ', 'NEAR', 'WITH', 'SAME']);

app.post('/api/search', (req, res)=> {
	const { query, operator } = req.body;
	if (query && operators.has(operator)) {
		lambda.invoke({
			FunctionName: 'queryParser',
			Payload: JSON.stringify({ query, operator })
		}, (err, data) => {
			if (data && data.StatusCode === 200) {
				client.search({
					index: process.env.ELASTIC_INDEX,
					body: {
						highlight: { fields: { text: { } } },
						...JSON.parse(JSON.parse(data.Payload))
					}
				}).then(response => {
					if (response.timed_out) res.status(504).end();
					else {
						// There will probably be several results with the same organizationId;
						// instead of looking them all we'll make a map of ids to names ourselves.
						// This might be unnecessary if sequelize caches id lookups?
						const names = {};
						Promise.all(response.hits.hits.map(hit => {
							const { _id: id, _score: score, highlight } = hit;
							const { text, organizationId, ...rest } = hit._source;
							if (names.organizationId === undefined) {
								names[organizationId] = Organization.findByPk(organizationId).then(org => org.name);
							}
							return names[organizationId].then(source => ({ id, score, source, highlight, ...rest }));
						})).then(hits => res.status(200).json({
							total: response.hits.total,
							max_score: response.hits.max_score,
							hits
						}));
					}
				});
			} else {
				res.status(400).json(err);
			}
		});
	} else {
		res.status(400).json('Invalid query or operator parameters');
	}
});
