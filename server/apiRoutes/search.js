import AWS from 'aws-sdk';
import elasticsearch from 'elasticsearch';

import app from '../server';

AWS.config.update({ region: process.env.AWS_REGION });

const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

const client = new elasticsearch.Client({
	host: process.env.ELASTIC_URL
});

const operators = new Set(['AND', 'OR', 'ADJ', 'NEAR', 'WITH', 'SAME']);

const previewLength = 1024;

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
					body: JSON.parse(JSON.parse(data.Payload))
				}).then(response => {
					if (response.timed_out) res.status(504).end();
					else {
						response.hits.hits.forEach((hit, index) => {
							const previewText = hit._source.text.slice(0, previewLength);
							response.hits.hits[index]._source.text = previewText;
						});
						res.status(200).json(response.hits);
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
