import Promise from 'bluebird';
import app from '../server';
import { Organization } from '../models';
import { generateHash } from '../utilities';
import { sendPasswordResetEmail } from '../emailHelpers';

app.post('/api/password-reset', (req, res) => {
	Organization.findOne({
		where: { email: req.body.email },
	})
		.then((organization) => {
			if (!organization) {
				throw new Error("Organization doesn't exist");
			}

			const updateData = {
				resetHash: generateHash(),
				resetHashExpiration: Date.now() + 1000 * 60 * 60 * 24, // Expires in 24 hours.
			};
			return Organization.update(updateData, {
				where: { id: organization.id },
				returning: true,
				individualHooks: true,
			});
		})
		.then((updatedOrganizationData) => {
			const updatedOrganization = updatedOrganizationData[1][0];
			return sendPasswordResetEmail({
				toEmail: updatedOrganization.email,
				slug: updatedOrganization.slug,
				resetUrl: `https://${req.hostname}/password-reset/${
					updatedOrganization.resetHash
				}/${updatedOrganization.slug}`,
			});
		})
		.then(() => {
			return res.status(200).json('success');
		})
		.catch((err) => {
			console.error('Error resetting password post', err);
			return res.status(401).json('Email address not recognized.');
		});
});

app.put('/api/password-reset', (req, res) => {
	const organization = req.user || {};
	const resetHash = req.body.resetHash;
	const slug = req.body.slug;
	const currentTime = Date.now();

	const whereQuery = organization.id
		? { id: organization.id }
		: { resetHash: resetHash, slug: slug };

	Organization.findOne({
		where: whereQuery,
	})
		.then((organizationData) => {
			if (!organizationData) {
				throw new Error("organization doesn't exist");
			}
			if (
				!organization.id &&
				resetHash &&
				organizationData.resetHashExpiration < currentTime
			) {
				throw new Error('Hash is expired');
			}

			/* Promisify the setPassword function, and use .update to match API convention */
			const setPassword = Promise.promisify(organizationData.setPassword, {
				context: organizationData,
			});
			return setPassword(req.body.password);
		})
		.then((passwordResetData) => {
			const updateData = {
				hash: passwordResetData.dataValues.hash,
				salt: passwordResetData.dataValues.salt,
				resetHash: '',
				resetHashExpiration: currentTime,
				passwordDigest: 'sha512',
			};
			return Organization.update(updateData, {
				where: whereQuery,
			});
		})
		.then(() => {
			return res.status(200).json('success');
		})
		.catch((err) => {
			return res.status(401).json(err.message);
		});
});
