import Promise from 'bluebird';
import React from 'react';
import UserContainer from 'containers/User/User';
import Html from '../Html';
import app from '../server';
import { User } from '../models';
import { renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';

app.get(['/user/:slug', '/user/:slug/:mode'], (req, res, next)=> {
	const getUserData = User.findOne({
		where: {
			slug: req.params.slug.toLowerCase()
		},
		attributes: {
			exclude: ['salt', 'hash', 'email', 'createdAt', 'updatedAt']
		},
	});

	return Promise.all([getInitialData(req), getUserData])
	.then(([initialData, userData])=> {
		if (!userData) { throw new Error('User Not Found'); }

		const newInitialData = {
			...initialData,
			userData: userData.toJSON(),
		};
		return renderToNodeStream(res,
			<Html
				chunkName="User"
				initialData={newInitialData}
				headerComponents={generateMetaComponents({
					initialData: newInitialData,
					title: `${userData.fullName} · PubPub`,
					description: userData.bio,
					image: userData.avatar,
				})}
			>
				<UserContainer {...newInitialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});
