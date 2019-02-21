import React from 'react';
import PropTypes from 'prop-types';
import { ProgressBar } from '@blueprintjs/core';

require('./organizationDocument.scss');

const propTypes = {
	documentData: PropTypes.object.isRequired,
};

const OrganizationDocument = function(props) {
	const name = props.documentData.name || props.documentData.fileName;
	const url = props.documentData.url || props.documentData.fileUrl;
	return (
		<div className="organization-document-component">
			<div>
				<b>{name}</b>
			</div>
			{url && (
				<div>
					<a href={url}>{url}</a>
				</div>
			)}
			{!url && (
				<ProgressBar
					value={props.documentData.progress === 1 ? null : props.documentData.progress}
				/>
			)}
		</div>
	);
};

OrganizationDocument.propTypes = propTypes;
export default OrganizationDocument;
