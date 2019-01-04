import Promise from 'bluebird';
import React from 'react';
import OrganizationCreate from 'containers/OrganizationCreate/OrganizationCreate';
import Html from '../Html';
import app from '../server';
import { Signup } from '../models';
import { renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';

app.get('/organization/create/:hash', (req, res, next)=> {
	const getSignup = Signup.findOne({
		where: { hash: req.params.hash, completed: false },
		attributes: ['email', 'hash']
	});

	return Promise.all([getInitialData(req), getSignup])
	.then(([initialData, signupData])=> {
		const newInitialData = {
			...initialData,
			signupData: signupData || { hashError: true },
		};
		return renderToNodeStream(res,
			<Html
				chunkName="OrganizationCreate"
				initialData={newInitialData}
				headerComponents={generateMetaComponents({
					initialData: newInitialData,
					title: 'Create New Organization · Prior Art Archive',
					unlisted: true,
				})}
			>
				<OrganizationCreate {...newInitialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});
