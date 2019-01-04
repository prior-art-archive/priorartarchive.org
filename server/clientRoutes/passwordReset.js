import Promise from 'bluebird';
import React from 'react';
import PasswordReset from 'containers/PasswordReset/PasswordReset';
import Html from '../Html';
import app from '../server';
import { Organization } from '../models';
import { renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';

app.get(['/password-reset', '/password-reset/:resetHash/:slug'], (req, res, next)=> {
	const findOrganization = Organization.findOne({
		where: { slug: req.params.slug },
	});

	return Promise.all([getInitialData(req), findOrganization])
	.then(([initialData, organizationData])=> {
		let hashIsValid = true;
		if (!organizationData) { hashIsValid = false; }
		if (organizationData && organizationData.resetHash !== req.params.resetHash) { hashIsValid = false; }
		if (organizationData && organizationData.resetHashExpiration < Date.now()) { hashIsValid = false; }

		const newInitialData = {
			...initialData,
			passwordResetData: { hashIsValid: hashIsValid },
		};
		return renderToNodeStream(res,
			<Html
				chunkName="PasswordReset"
				initialData={newInitialData}
				headerComponents={generateMetaComponents({
					initialData: newInitialData,
					title: 'Password Reset',
				})}
			>
				<PasswordReset {...newInitialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});
