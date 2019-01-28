import React from 'react';
import PropTypes from 'prop-types';

require('./document.scss');

const propTypes = {
	id: PropTypes.string.isRequired,
	organizationId: PropTypes.string.isRequired,
	title: PropTypes.string,
	description: PropTypes.string,
	text: PropTypes.string.isRequired,
	uploadDate: PropTypes.string.isRequired,
	publicationDate: PropTypes.string,
	contentType: PropTypes.string.isRequired,
	contentLength: PropTypes.number.isRequired,
};

const defaultProps = {
	title: '',
	description: '',
	publicationDate: '',
};

const Document = function(props) {
	return (
		<table>
			<tr><td>id</td><td>{props.id}</td></tr>
			<tr><td>title</td><td>{props.title}</td></tr>
			<tr><td>description</td><td>{props.description}</td></tr>
			<tr><td>text</td><td>{props.text}</td></tr>
			<tr><td>uploadDate</td><td>{props.uploadDate}</td></tr>
			<tr><td>publicationDate</td><td>{props.publicationDate}</td></tr>
			<tr><td>contentType</td><td>{props.contentType}</td></tr>
			<tr><td>contentLength</td><td>{props.contentLength}</td></tr>
			<tr><td>organizationId</td><td>{props.organizationId}</td></tr>
		</table>
	);
};

Document.propTypes = propTypes;
Document.defaultProps = defaultProps;
export default Document;
