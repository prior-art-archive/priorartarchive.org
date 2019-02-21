import React from 'react';
import OldSearch from 'containers/OldSearch/OldSearch';
import Search from 'containers/Search/Search';
import Html from '../Html';
import app from '../server';
import {
	renderToNodeStream,
	getInitialData,
	handleErrors,
	generateMetaComponents,
	operators,
	searchDefaults,
	useFullV2,
} from '../utilities';

const operatorSet = new Set(operators);

app.get('/search', (req, res, next) => {
	return getInitialData(req)
		.then((initialData) => {
			const { query: params } = initialData.locationData;

			const operator = operatorSet.has(params.operator)
				? params.operator
				: searchDefaults.operator;
			const sort = params.sort || searchDefaults.sort;
			const range = params.range || searchDefaults.range;
			const offset = Number(params.offset) || searchDefaults.offset;
			const fileType = params.fileType
				? params.fileType.split('+').map((mime) => decodeURIComponent(mime))
				: searchDefaults.fileType;
			const source = params.source ? params.source.split('+') : searchDefaults.source;

			// decodeURIComponent will throw a URIError if the query is malformed.
			// This might reasonably happen if someone tries to edit the query string in the URL bar.
			let query = params.query || searchDefaults.query;
			try {
				query = decodeURIComponent(query);
			} catch (e) {
				query = searchDefaults.query;
			}

			const newInitialData = {
				...initialData,
				searchData: {
					query: query,
					operator: operator,
					sort: sort,
					range: range,
					fileType: fileType,
					source: source,
					offset: offset,
				},
			};
			return renderToNodeStream(
				res,
				<Html
					chunkName={useFullV2(req) ? 'Search' : 'OldSearch'}
					initialData={newInitialData}
					headerComponents={generateMetaComponents({
						initialData: newInitialData,
						title: 'Search · Prior Art Archive',
					})}
				>
					{useFullV2(req) && <Search {...newInitialData} />}
					{!useFullV2(req) && <OldSearch {...newInitialData} />}
				</Html>,
			);
		})
		.catch(handleErrors(req, res, next));
});
