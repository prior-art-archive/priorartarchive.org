import React from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import { generateDocumentTitle } from 'utilities';

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
				<div className="title bp3-skeleton" />
				<div className="description bp3-skeleton" />
				<div className="date bp3-skeleton" />
			</div>
		);
	}

	const generatedTitle = generateDocumentTitle(props.data.title);
	const copyright = props.data.copyright || '';
	const highlight = props.data.highlight || null;
	const cpcCodes = props.data.cpcCodes || [];
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
		// console.log('Invalid Date', props.data.uploadDate, props.data.publicationDate);
	}

	const fileUrl = props.data.fileUrl;
	const documentUrl = props.data.id ? `/doc/${props.data.id}` : fileUrl;

	return (
		<div className="search-result-wrapper">
			<div className={`title ${generatedTitle.isPlaceholder ? 'placeholder' : ''}`}>
				<a href={documentUrl}>{generatedTitle.title}</a>
			</div>
			{fileUrl && (
				<a href={fileUrl} className="url">
					{fileUrl}
				</a>
			)}
			{highlight && (
				<div
					className="description"
					dangerouslySetInnerHTML={{ __html: highlight.text.join('... ') }}
				/>
			)}
			<div className="source">
				Source:{' '}
				<a href={`/organization/${props.data.sourceSlug}`}>{props.data.sourceName}</a>
			</div>
			{uploadDate && (
				<div className="date">Uploaded: {dateFormat(uploadDate, 'mmmm dS, yyyy')}</div>
			)}
			{publicationDate && (
				<div className="date">
					Published: {dateFormat(publicationDate, 'mmmm dS, yyyy')}
				</div>
			)}
			{copyright && <div className="date">©{copyright}</div>}
			{cpcCodes && cpcCodes.length > 0 && (
				<div className="cpc-codes">
					<span>CPC Codes:</span>
					{cpcCodes.map((code) => {
						return (
							<span key={code} className="bp3-tag bp3-minimal">
								{code}
							</span>
						);
					})}
				</div>
			)}
		</div>
	);
};

SearchResult.propTypes = propTypes;
SearchResult.defaultProps = defaultProps;
export default SearchResult;
