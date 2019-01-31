import Promise from 'bluebird';
import passport from 'passport';
import app from '../server';
import { Organization, Signup } from '../models';
import { slugifyString } from '../utilities';

app.post('/api/organizations', (req, res)=> {
	// Check that hash and email sync up
	// Create user
	// Update SignUp to 'completed'
	// Get and return authenticated user data
	const email = req.body.email.toLowerCase().trim();
	const name = req.body.name.trim();
	const slug = slugifyString(req.body.slug);

	Signup.findOne({
		where: { hash: req.body.hash, email: req.body.email.toLowerCase() },
		attributes: ['email', 'hash', 'completed']
	})
	.then((signUpData)=> {
		if (!signUpData) { throw new Error('Hash not valid'); }
		if (signUpData.completed) { throw new Error('Account already created'); }

		const newOrganization = {
			slug: slug,
			name: name,
			email: email,
			avatar: req.body.avatar,
			title: req.body.title,
			bio: req.body.bio,
		};

		const userRegister = Promise.promisify(Organization.register, { context: Organization });
		return userRegister(newOrganization, req.body.password);
	})
	.then(()=> {
		return Signup.update({ completed: true }, {
			where: { email: email, hash: req.body.hash, completed: false },
		});
	})
	.then(()=> {
		passport.authenticate('local')(req, res, ()=> {
			return res.status(201).json('success');
		});
	})
	.catch((err)=> {
		console.error('Error in postOrganization: ', err);
		return res.status(500).json(err);
	});
});

app.put('/api/organizations', (req, res)=> {
	const organization = req.user || {};
	const authenticated = req.user && req.body.organizationId === organization.id;
	if (!authenticated) { return res.status(500).json('Unauthorized'); }

	// Filter to only allow certain fields to be updated
	const updatedOrganization = {};
	Object.keys(req.body).forEach((key)=> {
		if (['slug', 'name', 'avatar', 'bio', 'website'].indexOf(key) > -1) {
			updatedOrganization[key] = req.body[key] && req.body[key].trim ? req.body[key].trim() : req.body[key];
			if (key === 'slug') {
				updatedOrganization.slug = updatedOrganization.slug.toLowerCase();
			}
			if (key === 'name') {
				updatedOrganization[key] = updatedOrganization[key].trim();
			}
		}
	});

	return Organization.update(updatedOrganization, {
		where: { id: req.body.organizationId }
	})
	.then(()=> {
		return res.status(201).json('success');
	})
	.catch((err)=> {
		console.error('Error putting Organization', err);
		return res.status(500).json(err);
	});
});

app.get('/api/organizations/id-by-slug', (req, res)=> {
	Organization.findOne({
		where: {
			slug: req.query.slug,
		},
		attributes: ['id', 'slug'],
	})
	.then((organizationData)=> {
		if (!organizationData) {
			return res.status(404).json('Slug not found');
		}
		return res.status(200).json(organizationData.id);
	})
	.catch(()=> {
		return res.status(500).json('Error: Invalid slug');
	});
});
