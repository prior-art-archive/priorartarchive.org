import React from 'react';
import Search from 'containers/Search/Search';
import Html from '../Html';
import app from '../server';
import { renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';

const defaultOperator = 'AND';

app.get('/search', (req, res, next)=> {
	return getInitialData(req)
	.then((initialData)=> {
		const operator = initialData.locationData.query.operator || defaultOperator;
		let query = initialData.locationData.query.query || '';
		try {
			query = decodeURIComponent(query);
		} catch (e) {
			query = '';
		}
		const newInitialData = {
			...initialData,
			searchData: { query, operator },
		};
		return renderToNodeStream(res,
			<Html
				chunkName="Search"
				initialData={newInitialData}
				headerComponents={generateMetaComponents({
					initialData: newInitialData,
					title: 'Search · Prior Art Archive',
				})}
			>
				<Search {...newInitialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});
