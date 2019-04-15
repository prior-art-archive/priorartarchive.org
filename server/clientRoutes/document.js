import Promise from 'bluebird';
import React from 'react';
import DocumentContainer from 'containers/Document/Document';
import Html from '../Html';
import app from '../server';
import { Document, Assertion, Organization } from '../models';
import {
	renderToNodeStream,
	getInitialData,
	handleErrors,
	generateMetaComponents,
	useFullV2,
} from '../utilities';

app.get('/doc/:id', (req, res, next) => {
	if (!useFullV2(req)) {
		return next();
	}
	const getDocumentData = Document.findByPk(req.params.id).then((document) =>
		Organization.findByPk(document.organizationId).then((organization) => ({
			...document.toJSON(),
			description: document.description,
			title: document.title,
			fileUrl: document.fileUrl,
			organizationName: organization.name,
			organizationSlug: organization.slug,
		})),
	);

	const getAssertionData = Assertion.findAll({ where: { documentId: req.params.id } }).then(
		(assertions) =>
			assertions.map((assertion) => ({
				cid: assertion.cid,
				fileCid: assertion.fileCid,
				fileName: assertion.fileName,
				createdAt: assertion.createdAt,
			})),
	);

	return Promise.all([getInitialData(req), getDocumentData, getAssertionData])
		.then(([initialData, documentData, assertionData]) => {
			if (!documentData) {
				throw new Error('Document Not Found');
			}

			const newInitialData = {
				...initialData,
				documentData: documentData,
				assertionData: assertionData,
			};

			return renderToNodeStream(
				res,
				<Html
					chunkName="Document"
					initialData={newInitialData}
					headerComponents={generateMetaComponents({
						initialData: newInitialData,
						title: documentData.title && `${documentData.title} · Prior Art Archive`,
						description: documentData.description,
					})}
				>
					<DocumentContainer {...newInitialData} />
				</Html>,
			);
		})
		.catch(handleErrors(req, res, next));
});
