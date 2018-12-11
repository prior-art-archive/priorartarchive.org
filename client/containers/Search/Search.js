import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

require('./search.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	searchData: PropTypes.object.isRequired,
};

class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div id="search-container">
				<PageWrapper
					loginData={this.props.loginData}
					locationData={this.props.locationData}
					hideFooter={true}
				>
					<div className="container narrow">
						<div className="row">
							<div className="col-12">
								<h1>Search</h1>
								{JSON.stringify(this.props.searchData)}
							</div>
						</div>
					</div>
				</PageWrapper>
			</div>
		);
	}
}

Search.propTypes = propTypes;
export default Search;

hydrateWrapper(Search);
