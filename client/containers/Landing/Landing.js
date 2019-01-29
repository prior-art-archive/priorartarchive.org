import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import SearchBar from 'components/SearchBar/SearchBar';
import { hydrateWrapper } from 'utilities';

require('./landing.scss');

const defaultOperator = 'AND';

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

class Landing extends React.Component {
	constructor(props) {
		super(props);
		this.state = { query: '', operator: defaultOperator };
		this.handleSearch = this.handleSearch.bind(this);
		this.handleQueryChange = this.handleQueryChange.bind(this);
		this.handleOperatorChange = this.handleOperatorChange.bind(this);
	}

	handleSearch(evt) {
		evt.preventDefault();
		const { query, operator } = this.state;
		window.location.href = `/search?query=${encodeURIComponent(query)}&operator=${operator}`;
	}

	handleQueryChange(event) {
		this.setState({ query: event.target.value });
	}

	handleOperatorChange(event) {
		this.setState({ operator: event.target.value });
	}

	render() {
		return (
			<div id="landing-container">
				<PageWrapper
					loginData={this.props.loginData}
					locationData={this.props.locationData}
					hideFooter={true}
				>
					<div className="container landing">
						<div className="row">
							<div className="col-12">
								<h1>Prior Art Archive</h1>
								<form onSubmit={this.handleSearch}>
									<SearchBar
										queryValue={this.state.query}
										onQueryChange={this.handleQueryChange}
										operatorValue={this.state.operator}
										onOperatorChange={this.handleOperatorChange}
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
