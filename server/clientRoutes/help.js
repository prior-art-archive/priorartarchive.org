import React from 'react';
import Help from 'containers/Help/Help';
import Html from '../Html';
import app from '../server';
import {
	renderToNodeStream,
	getInitialData,
	handleErrors,
	generateMetaComponents,
} from '../utilities';

app.get('/help', (req, res, next) => {
	return getInitialData(req)
		.then((initialData) => {
			return renderToNodeStream(
				res,
				<Html
					chunkName="Help"
					initialData={initialData}
					headerComponents={generateMetaComponents({
						initialData: initialData,
						title: 'Help · Prior Art Archive',
					})}
				>
					<Help {...initialData} />
				</Html>,
			);
		})
		.catch(handleErrors(req, res, next));
});
