import React, { Component } from 'react';
import PropTypes from 'prop-types';
import store from 'store/dist/store.legacy';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import SearchBar from 'components/SearchBar/SearchBar';
import SearchResult from 'components/SearchResult/SearchResult';
import { apiFetch, hydrateWrapper, searchDefaults, fileTypeMap } from 'utilities';
import { Radio, RadioGroup, Checkbox, Button } from '@blueprintjs/core';

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
		})
		.then(searchResults => {
			if (searchResults) {
				const searchHistory = store.get('searchHistory') || [];
				searchHistory.push({
					query: searchResults.query,
					searchedAt: new Date(),
					totalHits: searchResults.total,
					operator: searchResults.operator,
					sources: searchData.source.length
						? searchData.source.map((item)=> {
							return item.charAt(0).toUpperCase() + item.slice(1);
						}).join(', ')
						: 'All',
				});
				store.set('searchHistory', searchHistory);
			}
			return searchResults;
		}).catch(error => {
			throw error;
		});
	}

	// returns true if the two arguments are different
	// immutable.js was invented for this purpose :-/
	static updateSearchData(searchData, state) {
		return !!Object.keys(searchData).find(key => {
			// handle the array types separately
			if (key === 'fileType' || key === 'source') {
				if (searchData[key].length !== state[key].length) return true;
				return searchData[key].find(value => !state[key].includes(value));
			}
			return searchData[key] !== state[key];
		});
	}

	static calculationPagination(current, last) {
		const delta = 2;
		const left = current - delta;
		const right = current + delta + 1;
		const range = [];
		const rangeWithDots = [];
		let l;

		for (let index = 1; index <= last; index += 1) {
			if (index === 1 || index === last || (index >= left && index < right)) {
				range.push(index);
			}
		}

		range.forEach(index => {
			if (l) {
				if (index - l === 2) {
					rangeWithDots.push(l + 1);
				} else if (index - l !== 1) {
					rangeWithDots.push('...');
				}
			}
			rangeWithDots.push(index);
			l = index;
		});

		return rangeWithDots;
	}

	static updateUrl(searchData) {
		const queryString = Object.keys(searchData).map(key => {
			let value = searchData[key];
			if (key === 'query') {
				value = encodeURIComponent(value.trim());
			} else if (key === 'source') {
				if (value.length === 0) return null;
				value = value.join('+');
			} else if (key === 'fileType') {
				if (value.length === 0) return null;
				value = value.map(mime => encodeURIComponent(mime)).join('+');
			}
			if (value === searchDefaults[key]) return null;
			return `${key}=${value}`;
		}).filter(param => param !== null).join('&');

		window.history.pushState(searchData, '', `/search?${queryString}`);
		window.scrollTo(0, 0);
	}

	constructor(props) {
		super(props);

		this.state = {
			error: null,
			result: null,
			aggregations: null,
			queryValue: props.searchData.query,
			operatorValue: props.searchData.operator,
			emptyQueryWarning: props.searchData.query.trim() === '',
			...props.searchData,
		};

		this.handleQueryChange = this.handleQueryChange.bind(this);
		this.handleOperatorChange = this.handleOperatorChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleNextPage = this.handleNextPage.bind(this);
		this.handlePreviousPage = this.handlePreviousPage.bind(this);
	}

	componentDidMount() {
		Search.fetchResults(this.props.searchData).then(result => {
			if (result) {
				this.setState({ error: null, result, aggregations: result.aggregations });
			}
		}).catch(error => {
			this.setState({ error, result: null, aggregations: null });
		});
	}

	componentDidUpdate(props, state) {
		if (props.locationData.queryString !== this.props.locationData.queryString) {
			// I don't think this will ever happen
			// because our props are never updated?
			const { searchData } = this.props;
			Search.updateUrl(searchData);
			Search.fetchResults(searchData).then(result => {
				if (result) {
					this.setState({
						error: null,
						result,
						aggregations: result.aggregations,
						...searchData
					});
				}
			}).catch(error => {
				this.setState({ error, result: null, aggregations: null });
			});
		} else if (!this.state.emptyQueryWarning) {
			const {
				error: _error,
				result: _result,
				emptyQueryWarning,
				queryValue,
				operatorValue,
				aggregations,
				...searchData
			} = this.state;
			if (Search.updateSearchData(searchData, state)) {
				Search.updateUrl(searchData);
				Search.fetchResults(searchData).then(result => {
					if (result) {
						this.setState({
							error: null,
							result,
							aggregations: aggregations || result.aggregations,
							...searchData
						});
					}
				}).catch(error => {
					this.setState({ error, result: null, aggregations: null });
				});
			}
		}
	}

	setOffset(offset) {
		this.setState({ offset });
	}

	handleSearch(event) {
		event.preventDefault();
		const { queryValue, operatorValue, query, operator } = this.state;
		if (!queryValue.trim()) {
			this.setState({ emptyQueryWarning: true });
		} else if (queryValue !== query || operatorValue !== operator) {
			this.setState({
				emptyQueryWarning: false,
				query: queryValue,
				operator: operatorValue,
				// Clear filters and offset
				// sort: searchDefaults.sort, // ???
				fileType: searchDefaults.fileType,
				range: searchDefaults.range,
				source: searchDefaults.source,
				offset: searchDefaults.offset,
				// Clear aggregations
				aggregations: null,
			});
		}
	}

	handleQueryChange(event) {
		this.setState({ queryValue: event.target.value });
	}

	handleOperatorChange(event) {
		this.setState({ operatorValue: event.target.value });
	}

	handlePreviousPage() {
		this.setState(({ offset }) => ({ offset: Math.max(offset - 10, 0) }));
	}

	handleNextPage() {
		this.setState(({ offset }) => ({ offset: offset + 10 }));
	}

	renderResults() {
		const { error, result, offset } = this.state;

		if (error !== null) {
			console.error(error);
			return <p className="error">Search failed with an error from the server.</p>;
		}
		if (result === null) {
			return null;
		}
		if (result.total === 0) {
			return <p>No results found</p>;
		}

		const numPages = result && Math.min(Math.ceil(result.total / 10), 1000);
		const currentPage = Math.floor(offset / 10) + 1;

		return (
			<div className="results-content">
				{result.hits.map(hit => <SearchResult key={hit.id} data={hit} />)}
				<div className="page-buttons">
					<div className="bp3-button-group">
						{!!this.state.offset &&
							<Button onClick={this.handlePreviousPage} text="Previous" />
						}
						{Search.calculationPagination(currentPage, numPages).map((item)=> {
							if (item === '...') {
								return (
									<Button key={item} className="bp3-disabled" text="..." />
								);
							}
							const className = item === currentPage ? 'bp3-active' : '';
							return (
								<Button
									key={item}
									className={className}
									onClick={() => this.setOffset((item - 1) * 10)}
									text={item}
								/>
							);
						})}
						{currentPage !== numPages &&
							<Button onClick={this.handleNextPage} text="Next" />
						}
					</div>
				</div>
			</div>
		);
	}

	renderFilters() {
		const { source, fileType, aggregations } = this.state;
		const sourceSet = new Set(source);
		const fileTypeSet = new Set(fileType);
		return (
			<div className="results-filters">
				{/* <div className="filter-block">
					<h6>Sort</h6>
					<RadioGroup
						onChange={this.handleSortChange}
						selectedValue={this.state.sort}
					>
						<Radio label="Date" value="date" />
						<Radio label="Relevancy" value="relevancy" />
					</RadioGroup>
				</div> */}

				{/* <h5 className={'filter-header'}>Filter</h5> */}
				{aggregations && aggregations.source.buckets.length &&
					<div className="filter-block">
						<h6>Source</h6>
						{aggregations.source.buckets.map(item => {
							const { name, slug, count } = item;
							const nextState = {
								offset: 0,
								source: sourceSet.has(slug)
									? source.filter(elem => elem !== slug)
									: [...source, slug]
							};
							return (
								<Checkbox
									checked={sourceSet.has(slug)}
									label={
										<span className="option-wrapper">
											<span className="option-key">{name}</span>
											{count}
										</span>
									}
									onChange={() => this.setState(nextState)}
									key={`source-${slug}`}
								/>
							);
						})}
					</div>
				}

				{aggregations && aggregations.fileType.buckets.length &&
					<div className="filter-block">
						<h6>File Type</h6>
						{aggregations.fileType.buckets.map(item => {
							const { key, doc_count: count } = item;
							const name = fileTypeMap[key] || key;
							const nextState = {
								offset: 0,
								fileType: fileTypeSet.has(key)
									? fileType.filter(mime => mime !== key)
									: [...fileType, key]
							};

							return (
								<Checkbox
									checked={fileTypeSet.has(key)}
									label={
										<span className="option-wrapper">
											<span className="option-key">{name}</span>
											{count}
										</span>
									}
									onChange={() => this.setState(nextState)}
									key={`fileType-${key}`}
								/>
							);
						})}
					</div>
				}

				{/* !!result.aggregations.dateRange.buckets.length &&
					<div className="filter-block">
						<h6>Date Range</h6>
						<RadioGroup
							onChange={(evt)=> {
								const newState = {
									...this.state,
									range: evt.target.value,
								};
								this.updateUrl(newState);
							}}
							selectedValue={this.state.range}
						>
							<Radio
								label={
									<span className="option-wrapper">
										<span className="option-key">All</span>
										{searchData.totalHits}
									</span>
								}
								value="all"
							/>
							{dateRanges.map((item)=> {
								const key = item.key[0];
								const value = item.value[0];
								return (
									<Radio
										key={`range-${key}`}
										label={
											<span className="option-wrapper">
												<span className="option-key">{key}</span>
												{value}
											</span>
										}
										value={key}
									/>
								);
							})}
						</RadioGroup>
					</div>
				*/}
			</div>
		);
	}

	render() {
		const { result } = this.state;

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
										queryValue={this.state.queryValue}
										onQueryChange={this.handleQueryChange}
										operatorValue={this.state.operatorValue}
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
								{/* {isLoading &&
										<Spinner />
								} */}
								{this.renderResults()}
								{result && this.renderFilters()}
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
