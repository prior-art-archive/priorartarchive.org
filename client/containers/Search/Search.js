import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import SearchBar from 'components/SearchBar/SearchBar';
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
		const { query, operator } = props.searchData;
		this.state = { result: null, query, operator };
		this.handleQueryChange = this.handleQueryChange.bind(this);
		this.handleOperatorChange = this.handleOperatorChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
	}

	componentDidMount() {
		Search.fetchResults(this.props.searchData).then(result => this.setState({ result }));
	}

	handleSearch(event) {
		event.preventDefault();
		if (!this.state.query.trim()) {
			return this.setState({ emptyQueryWarning: true });
		}
		const { query, operator } = this.state;
		const searchData = { query, operator };
		window.history.pushState(searchData, '', `/search?query=${encodeURIComponent(query)}&operator=${operator}`);
		window.scrollTo(0, 0);
		return Search.fetchResults(searchData).then(result => this.setState({ result, emptyQueryWarning: false }));
	}

	handleQueryChange(event) {
		this.setState({ query: event.target.value });
	}

	handleOperatorChange(event) {
		this.setState({ operator: event.target.value });
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
			<div className="results-content">
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
								<form onSubmit={this.handleSearch}>
									<SearchBar
										queryValue={this.state.query}
										onQueryChange={this.handleQueryChange}
										operatorValue={this.state.operator}
										onOperatorChange={this.handleOperatorChange}
									/>
								</form>
								{this.state.emptyQueryWarning &&
									<div className="warning">Enter keywords and then click Search</div>
								}
							</div>
						</div>
						<div className="row">
							<div className="col-12 results">
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
