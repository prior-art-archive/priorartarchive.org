import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

require('./document.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	documentData: PropTypes.object.isRequired,
};

const placeholderTitle = 'Untitled Document';
const placeholderDescription = 'No description available.';

const Document = function(props) {
	const { title, description, fileName, fileUrl } = props.documentData;
	return (
		<div id="document-container">
			<PageWrapper loginData={props.loginData} locationData={props.locationData}>
				<div className="container">
					<div className="row">
						<div className="col-12">
							<header>
								<h1 className={!!title || 'placeholder'}>
									{title || placeholderTitle}
								</h1>
							</header>
							<section className={!!description || 'placeholder'}>
								{description || placeholderDescription}
							</section>
							<pre>
								<a className="raw-file" href={fileUrl}>
									{fileName}
								</a>
							</pre>
							<iframe title="preview" frameBorder="0" allowFullScreen src={fileUrl} />
						</div>
					</div>
				</div>
			</PageWrapper>
		</div>
	);
};

Document.propTypes = propTypes;
export default Document;

hydrateWrapper(Document);
