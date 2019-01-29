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
		this.state = {
			result: null,
			q: props.searchData.query,
			o: props.searchData.operator,
		};
		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.handleOperatorChange = this.handleOperatorChange.bind(this);
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
	}

	componentDidMount() {
		Search.fetchResults(this.props.searchData).then(result => this.setState({ result }));
	}

	handleSearchSubmit(event) {
		event.preventDefault();
		if (!this.state.q) {
			return this.setState({ emptyQueryWarning: true });
		}
		const { q: query, o: operator } = this.state;
		const searchData = { query, operator };
		window.history.pushState(searchData, '', `/search?query=${encodeURIComponent(query)}&operator=${operator}`);
		window.scrollTo(0, 0);
		return Search.fetchResults(searchData).then(result => this.setState({ result }));
	}

	handleSearchChange(event) {
		this.setState({ q: event.target.value });
	}

	handleOperatorChange(event) {
		this.setState({ o: event.target.value });
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
								<form onSubmit={this.handleSearchSubmit}>
									<SearchBar
										queryValue={this.state.q}
										onQueryChange={this.handleSearchChange}
										operatorValue={this.state.o}
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
