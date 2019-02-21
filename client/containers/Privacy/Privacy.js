import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

const Privacy = function(props) {
	return (
		<div id="privacy-container">
			<PageWrapper loginData={props.loginData} locationData={props.locationData}>
				<div className="legal-wrapper">
					<div className="container narrow">
						<div className="row">
							<div className="col-12">
								<h1>Privacy Policy</h1>
							</div>
						</div>
					</div>
				</div>
			</PageWrapper>
		</div>
	);
};

Privacy.propTypes = propTypes;
export default Privacy;

hydrateWrapper(Privacy);
