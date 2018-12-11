import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

require('./landing.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

class Landing extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<div id="landing-container">
				<PageWrapper
					loginData={this.props.loginData}
					locationData={this.props.locationData}
				>
					<div className="container">
						<div className="row">
							<div className="col-12">
								<input placeholder="search" />
							</div>
						</div>
					</div>
				</PageWrapper>
			</div>
		);
	}
}

Landing.propTypes = propTypes;
export default Landing;

hydrateWrapper(Landing);
