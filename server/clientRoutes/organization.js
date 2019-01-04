import Promise from 'bluebird';
import React from 'react';
import OrganizationContainer from 'containers/Organization/Organization';
import Html from '../Html';
import app from '../server';
import { Organization } from '../models';
import { renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';

app.get(['/organization/:slug', '/organization/:slug/:mode'], (req, res, next)=> {
	const getOrganizationData = Organization.findOne({
		where: {
			slug: req.params.slug.toLowerCase()
		},
		attributes: {
			exclude: ['salt', 'hash', 'email', 'createdAt', 'updatedAt']
		},
	});

	return Promise.all([getInitialData(req), getOrganizationData])
	.then(([initialData, organizationData])=> {
		if (!organizationData) { throw new Error('Organization Not Found'); }

		const newInitialData = {
			...initialData,
			organizationData: organizationData.toJSON(),
		};
		return renderToNodeStream(res,
			<Html
				chunkName="Organization"
				initialData={newInitialData}
				headerComponents={generateMetaComponents({
					initialData: newInitialData,
					title: `${organizationData.name} · Prior Art Archive`,
					description: organizationData.bio,
					image: organizationData.avatar,
				})}
			>
				<OrganizationContainer {...newInitialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});
