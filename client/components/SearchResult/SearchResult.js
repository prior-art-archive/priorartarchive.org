import React from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';

require('./searchResult.scss');

const propTypes = {
	isLoading: PropTypes.bool,
	data: PropTypes.object,
};

const defaultProps = {
	data: {},
	isLoading: false,
};

const SearchResult = function(props) {
	if (props.isLoading) {
		return (
			<div className="search-result-wrapper loading">
				<div className="title pt-skeleton" />
				<div className="description pt-skeleton" />
				<div className="date pt-skeleton" />
			</div>
		);
	}

	// title: null,
	// description: null,
	// publicationDate: null,
	// id: PropTypes.string.isRequired,
	// organizationId: PropTypes.string.isRequired,
	// title: PropTypes.string,
	// description: PropTypes.string,
	// uploadDate: PropTypes.string.isRequired,
	// publicationDate: PropTypes.string,
	// contentType: PropTypes.string.isRequired,
	// contentLength: PropTypes.number.isRequired,

	const title = props.data.title || '';
	const copyright = props.data.copyright || [];
	const cpcCodes = props.data.cpccodes || [[]];
	let uploadDate;
	let publicationDate;

	try {
		/* Safari has a problem with dates formatted as such:
		"2016-02-23T11:57:43-0500" or "2016-02-23T16:57:43.000+0000"
		It seems the trailing timezone data causes an error. So - simply try to strip that
		And if it fails, don't render that associated date.
		*/
		uploadDate = props.data.uploadDate.replace(/[+-]{1}[0-9]{4}$/, '');
		publicationDate = props.data.publicationDate.replace(/[+-]{1}[0-9]{4}$/, '');
	} catch (err) {
		console.log('Invalid Date');
	}
	const formattedUrl = `/doc/${props.data.id}`;
	return (
		<div className="search-result-wrapper">
			<div className="title">
				<a href={formattedUrl}>{title}</a>
			</div>
			{/* <div className="url">{formattedUrl}</div> */}
			<div className="description">
				{props.data.highlight && props.data.highlight.text.map((preview, i) => (
					<div key={i.toString()} dangerouslySetInnerHTML={{ __html: preview }} />
				))}
			</div>
			<div className="source">Source: {props.data.source}</div>
			{uploadDate &&
				<div className="date">Uploaded: {dateFormat(uploadDate, 'mmmm dS, yyyy')}</div>
			}
			{publicationDate &&
				<div className="date">Published: {dateFormat(publicationDate, 'mmmm dS, yyyy')}</div>
			}
			{copyright[0] &&
				<div className="date">©{copyright[0]}</div>
			}
			{cpcCodes[0][0] &&
				<div className="cpc-codes">
					<span>CPC Codes:</span>
					{cpcCodes[0].map((code)=> {
						return <span key={code} className="pt-tag pt-minimal">{code}</span>;
					})}
				</div>
			}
		</div>

	);
};

SearchResult.propTypes = propTypes;
SearchResult.defaultProps = defaultProps;
export default SearchResult;
