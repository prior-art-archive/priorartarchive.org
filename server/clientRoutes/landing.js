import React from 'react';
import Landing from 'containers/Landing/Landing';
import Html from '../Html';
import app from '../server';
import { renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';

app.get('/', (req, res, next)=> {
	return getInitialData(req)
	.then((initialData)=> {
		return renderToNodeStream(res,
			<Html
				chunkName="Landing"
				initialData={initialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: 'Prior Art Archive',
				})}
			>
				<Landing {...initialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});
