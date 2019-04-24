import React from 'react';
import PropTypes from 'prop-types';
import { generateDocumentTitle } from 'utilities';
import { ProgressBar } from '@blueprintjs/core';

require('./organizationDocument.scss');

const propTypes = {
	documentData: PropTypes.object.isRequired,
};

const OrganizationDocument = function(props) {
	const generatedTitle = generateDocumentTitle(props.documentData);
	const url = props.documentData.id ? `/doc/${props.documentData.id}` : props.documentData.url;
	return (
		<li className="organization-document-component">
			{url && <a href={url}>{generatedTitle.title}</a>}
			{!url && <div>{generatedTitle.title}</div>}
			{!url && (
				<ProgressBar
					value={props.documentData.progress === 1 ? null : props.documentData.progress}
				/>
			)}
		</li>
	);
};

OrganizationDocument.propTypes = propTypes;
export default OrganizationDocument;
