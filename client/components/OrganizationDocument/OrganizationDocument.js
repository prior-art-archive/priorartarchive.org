import React from 'react';
import PropTypes from 'prop-types';
import { ProgressBar } from '@blueprintjs/core';

require('./organizationDocument.scss');

const propTypes = {
	documentData: PropTypes.object.isRequired,
};

const OrganizationDocument = function(props) {
	const name = props.documentData.title || props.documentData.fileName || props.documentData.name;
	const url = props.documentData.id ? `/doc/${props.documentData.id}` : props.documentData.url;
	return (
		<li className="organization-document-component">
			{url && <a href={url}>{name}</a>}
			{!url && <div>{name}</div>}
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
