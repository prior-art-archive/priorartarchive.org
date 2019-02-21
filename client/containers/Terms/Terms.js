import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

const Terms = function(props) {
	return (
		<div id="terms-container">
			<PageWrapper loginData={props.loginData} locationData={props.locationData}>
				<div className="legal-wrapper">
					<div className="container narrow">
						<div className="row">
							<div className="col-12">
								<h1>Terms of Service</h1>
							</div>
						</div>
					</div>
				</div>
			</PageWrapper>
		</div>
	);
};

Terms.propTypes = propTypes;
export default Terms;

hydrateWrapper(Terms);
