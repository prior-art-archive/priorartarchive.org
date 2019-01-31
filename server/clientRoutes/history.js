import React from 'react';
import History from 'containers/History/History';
import Html from '../Html';
import app from '../server';
import {
	renderToNodeStream,
	getInitialData,
	handleErrors,
	generateMetaComponents,
} from '../utilities';

app.get('/history', (req, res, next) => {
	return getInitialData(req)
	.then((initialData) => {
		return renderToNodeStream(
			res,
			<Html
				chunkName="History"
				initialData={initialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: 'Search History · Prior Art Archive',
				})}
			>
				<History {...initialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});
