import Promise from 'bluebird';
import React from 'react';
import DocumentContainer from 'containers/Document/Document';
import Html from '../Html';
import app from '../server';
import { Document } from '../models';
import {
	renderToNodeStream,
	getInitialData,
	handleErrors,
	generateMetaComponents,
	isPriorArtV2,
} from '../utilities';

app.get('/doc/:id', (req, res, next) => {
	if (!isPriorArtV2) {
		return next();
	}
	const getDocumentData = Document.findOne({ where: { id: req.params.id } });

	return Promise.all([getInitialData(req), getDocumentData])
		.then(([initialData, documentData]) => {
			if (!documentData) {
				throw new Error('Document Not Found');
			}

			const newInitialData = {
				...initialData,
				documentData: documentData.toJSON(),
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
