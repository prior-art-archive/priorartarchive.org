import React from 'react';
import Terms from 'containers/Terms/Terms';
import Html from '../Html';
import app from '../server';
import { renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';

app.get('/terms', (req, res, next)=> {
	return getInitialData(req)
	.then((initialData)=> {
		return renderToNodeStream(res,
			<Html
				chunkName="Terms"
				initialData={initialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: 'Terms of Service · Prior Art Archive',
				})}
			>
				<Terms {...initialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});
