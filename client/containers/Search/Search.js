import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import SearchResult from 'components/SearchResult/SearchResult';
import { apiFetch, hydrateWrapper } from 'utilities';

require('./search.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	searchData: PropTypes.object.isRequired,
};

class Search extends Component {
	static fetchResults(searchData) {
		return apiFetch('/api/search', {
			method: 'POST',
			body: JSON.stringify(searchData)
		});
	}

	constructor(props) {
		super(props);
		this.state = { result: null };
	}

	componentDidMount() {
		Search.fetchResults(this.props.searchData).then(result => this.setState({ result }));
	}

	renderResults() {
		const { result } = this.state;
		if (result === null) {
			return null;
		}
		if (result.total === 0) {
			return <p>No results found</p>;
		}
		return (
			<div>
				{result.hits.map((data) => (
					<SearchResult key={data.id} data={data} />
				))}
			</div>
		);
	}

	render() {
		return (
			<div id="search-container">
				<PageWrapper
					loginData={this.props.loginData}
					locationData={this.props.locationData}
					hideFooter={true}
				>
					<div className="container">
						<div className="row">
							<div className="col-12">
								{this.renderResults()}
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
