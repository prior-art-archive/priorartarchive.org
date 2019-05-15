// import passport from 'passport';
import app from '../server';
import { Document } from '../models';

app.put('/api/documents', (req, res) => {
	Document.findOne({
		where: { id: (req.body.document || {}).id },
	})
		.then((document) => {
			if (!document) {
				return res.status(404).json('Document not found');
			}
			const authenticated = (req.user || {}).id === document.organizationId;
			if (!authenticated) {
				return res.status(401).json('Unauthorized');
			}

			return document
				.update({
					title: req.body.document.title,
					description: req.body.document.description,
				}, { where: { id: req.body.document.id } })
				.then(() => {
					return res.status(200).json('success');
				})
				.catch((err) => {
					return res.status(500).json(err);
				});
		})
		.catch((err) => {
			return res.status(500).json(err);
		});
});
