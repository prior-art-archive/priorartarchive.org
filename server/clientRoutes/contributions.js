import React from 'react';
import Contributions from 'containers/Contributions/Contributions';
import Html from '../Html';
import app from '../server';
import {
	renderToNodeStream,
	getInitialData,
	handleErrors,
	generateMetaComponents,
} from '../utilities';

app.get('/contributions', (req, res, next) => {
	return getInitialData(req)
		.then((initialData) => {
			return renderToNodeStream(
				res,
				<Html
					chunkName="Contributions"
					initialData={initialData}
					headerComponents={generateMetaComponents({
						initialData: initialData,
						title: 'Contributions · Prior Art Archive',
					})}
				>
					<Contributions {...initialData} />
				</Html>,
			);
		})
		.catch(handleErrors(req, res, next));
});
