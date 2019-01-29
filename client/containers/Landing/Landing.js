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
			query: '',
		};
		this.handleSearch = this.handleSearch.bind(this);
	}

	handleSearch(evt) {
		evt.preventDefault();
		window.location.href = `/search?query=${encodeURIComponent(this.state.query)}`;
	}

	render() {
		return (
			<div id="landing-container">
				<PageWrapper
					loginData={this.props.loginData}
					locationData={this.props.locationData}
					hideFooter={true}
				>
					<div className="container">
						<div className="row">
							<div className="col-12">
								<h1>Prior Art Archive</h1>
								<form onSubmit={this.handleSearch}>
									<input
										placeholder="Search..."
										value={this.state.query}
										onChange={(evt)=> {
											this.setState({ query: evt.target.value });
										}}
									/>
								</form>
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
