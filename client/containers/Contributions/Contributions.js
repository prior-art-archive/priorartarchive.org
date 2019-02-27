import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

require('./contributions.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

const Contributions = function(props) {
	return (
		<div id="contributions-container">
			<PageWrapper loginData={props.loginData} locationData={props.locationData}>
				<div className="container narrow">
					<div className="row">
						<div className="col-12">
							<h1>Contribution Guidelines</h1>

							<p>
								Contribute only those documents which are technical in nature and
								will aid USPTO to make inform decision in granting or rejecting
								patents.{' '}
							</p>

							<p>
								<b>File formats supported:</b>
							</p>
							<ul>
								<li>Word</li>
								<li>Pdf, Images</li>
								<li>Web pages</li>
								<li>Excel</li>
								<li>Text</li>
								<li>Video</li>
							</ul>

							<p>
								<b>Metadata Requirements:</b>
							</p>
							<ul>
								<li>Title</li>
								<li>Description</li>
								<li>Creation Date</li>
								<li>Publication Date</li>
								<li>Modification Date</li>
								<li>Copyright</li>
							</ul>
						</div>
					</div>
				</div>
			</PageWrapper>
		</div>
	);
};

Contributions.propTypes = propTypes;
export default Contributions;

hydrateWrapper(Contributions);
