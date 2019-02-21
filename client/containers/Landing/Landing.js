import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import SearchBar from 'components/SearchBar/SearchBar';
import { hydrateWrapper, searchDefaults } from 'utilities';

require('./landing.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

class Landing extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			queryValue: searchDefaults.query,
			operatorValue: searchDefaults.operator,
		};
		this.handleSearch = this.handleSearch.bind(this);
		this.handleQueryChange = this.handleQueryChange.bind(this);
		this.handleOperatorChange = this.handleOperatorChange.bind(this);
	}

	handleSearch(evt) {
		evt.preventDefault();
		const { queryValue, operatorValue } = this.state;
		if (queryValue.trim()) {
			let path = `/search?query=${encodeURIComponent(queryValue)}`;
			if (operatorValue !== searchDefaults.operator) {
				path += `&operator=${operatorValue}`;
			}
			window.location.href = path;
		}
	}

	handleQueryChange(event) {
		this.setState({ queryValue: event.target.value });
	}

	handleOperatorChange(event) {
		this.setState({ operatorValue: event.target.value });
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
										queryValue={this.state.queryValue}
										onQueryChange={this.handleQueryChange}
										operatorValue={this.state.operatorValue}
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
