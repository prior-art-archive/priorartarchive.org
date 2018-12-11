import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

require('./about.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

const Terms = function(props) {
	return (
		<div id="about-container">
			<PageWrapper
				loginData={props.loginData}
				locationData={props.locationData}
			>
				<div className="container narrow">
					<div className="row">
						<div className="col-12">
							<h1>Our Mission</h1>
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
