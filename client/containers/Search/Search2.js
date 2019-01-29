import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { NonIdealState, Radio, RadioGroup, Checkbox, Button, Spinner } from '@blueprintjs/core';
import SearchBar from 'components/SearchBar/SearchBar';
import SearchResult from 'components/SearchResult/SearchResult';
import Footer from 'components/Footer/Footer';

import { apiFetch, hydrateWrapper } from 'utilities';

require('./search2.scss');

const propTypes = {
	// dispatch: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	searchData: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
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
		const queryObject = queryString.parse(props.location.search);
		this.state = {
			emptyQueryWarning: false,
			q: decodeURIComponent(queryObject.q) || '',
			operator: queryObject.operator || 'AND',
		};

		this.getSearchData = this.getSearchData.bind(this);
		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
		this.updateUrl = this.updateUrl.bind(this);
		this.handleOperatorChange = this.handleOperatorChange.bind(this);
		this.handleSortChange = this.handleSortChange.bind(this);
		this.handlePreviousPage = this.handlePreviousPage.bind(this);
		this.handleNextPage = this.handleNextPage.bind(this);
		this.setOffset = this.setOffset.bind(this);
		this.calculationPagination = this.calculationPagination.bind(this);
	}

	componentWillMount() {
		this.getSearchData(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.search !== this.props.location.search) {
			this.getSearchData(nextProps);
			const queryObject = queryString.parse(nextProps.location.search);
			this.setState({
				q: decodeURIComponent(queryObject.q) || '',
				operator: queryObject.operator || 'AND',
				sort: queryObject.sort || 'date',
				range: queryObject.range || 'all',
				file: queryObject.file || '',
				source: queryObject.source || '',
				offset: Number(queryObject.offset) || 0,
			});
		}
	}

	// getSearchData(props) {
	// 	const queryObject = queryString.parse(props.location.search);
	// 	const queryParams = {
	// 		query: decodeURIComponent(queryObject.q) || '',
	// 		operator: queryObject.operator || 'AND',
	// 		sort: queryObject.sort || 'date',
	// 		range: queryObject.range,
	// 		file: queryObject.file,
	// 		source: queryObject.source,
	// 		offset: Number(queryObject.offset) || 0,
	// 	};

	// 	const searchParams = {
	// 		searchQuery: queryParams.q,
	// 		searchOperator: queryParams.operator,
	// 		fetchHits: 10,
	// 		fetchOffset: queryParams.offset,
	// 		sortBy: queryParams.sort,
	// 		filters: [],
	// 	};
	// 	if (queryParams.range) {
	// 		searchParams.filters.push({
	// 			filterName: 'Date Range',
	// 			filterData: [queryParams.range]
	// 		});
	// 	}
	// 	if (queryParams.file) {
	// 		searchParams.filters.push({
	// 			filterName: 'File Type',
	// 			filterData: queryParams.file.trim().split('+'),
	// 		});
	// 	}
	// 	if (queryParams.source) {
	// 		searchParams.filters.push({
	// 			filterName: 'Source',
	// 			filterData: queryParams.source.trim().split('+'),
	// 		});
	// 	}

	// 	this.props.dispatch(getSearch(searchParams));

	// 	Search.fetchResults({
	// 		query: queryObject.q,
	// 		operator: queryObject.operator || 'AND',
	// 	}).then(results => )
	// }

	setOffset(offset) {
		const newState = {
			...this.state,
			offset: offset,
		};
		this.updateUrl(newState);
	}

	handleNextPage() {
		const newState = {
			...this.state,
			offset: this.state.offset + 10,
		};
		this.updateUrl(newState);
	}

	handlePreviousPage() {
		const newState = {
			...this.state,
			offset: Math.max(this.state.offset - 10, 0)
		};
		this.updateUrl(newState);
	}

	handleSortChange(evt) {
		const newState = {
			...this.state,
			sort: evt.target.value
		};
		this.updateUrl(newState);
	}

	handleOperatorChange(evt) {
		const newState = {
			...this.state,
			operator: evt.target.value
		};
		this.updateUrl(newState);
	}

	handleSearchChange(evt) {
		this.setState({
			q: evt.target.value,
			emptyQueryWarning: false,
		});
	}

	handleSearchSubmit(evt) {
		evt.preventDefault();
		if (!this.state.q) {
			return this.setState({ emptyQueryWarning: true });
		}
		return this.updateUrl(this.state);
	}

	updateUrl(state) {
		const prevQueryObject = queryString.parse(this.props.location.search);
		const queryObject = queryString.parse(queryString.stringify({ ...state }));
		queryObject.q = encodeURIComponent(queryObject.q);
		delete queryObject.emptyQueryWarning;
		if (queryObject.operator === 'AND') {
			delete queryObject.operator;
		}
		if (queryObject.sort === 'date') {
			delete queryObject.sort;
		}
		if (queryObject.range === 'all') {
			delete queryObject.range;
		}
		if (!queryObject.file) {
			delete queryObject.file;
		}
		if (!queryObject.source) {
			delete queryObject.source;
		}
		if (!queryObject.offset) {
			delete queryObject.offset;
		}
		if (prevQueryObject.q !== queryObject.q) {
			delete queryObject.range;
			delete queryObject.file;
			delete queryObject.source;
			delete queryObject.offset;
		}
		this.props.history.push(`/search?${queryString.stringify(queryObject)}`);
		window.scrollTo(0, 0);
	}

	calculationPagination(current, last) {
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
		// for (let index of range) {
		// 	if (l) {
		// 		if (index - l === 2) {
		// 			rangeWithDots.push(l + 1);
		// 		} else if (index - l !== 1) {
		// 			rangeWithDots.push('...');
		// 		}
		// 	}
		// 	rangeWithDots.push(index);
		// 	l = index;
		// }

		return rangeWithDots;
	}

	render() {
		const queryObject = queryString.parse(this.props.location.search);
		const isLoading = this.props.searchData.isLoading;
		const isError = !!this.props.searchData.error;
		const searchData = this.props.searchData.data || {};
		const resultItems = searchData.usptoResponses || [];
		const facets = searchData.facets || [];
		const numPages = Math.min(Math.ceil(searchData.totalHits / 10), 1000);
		const currentPage = Math.floor(this.state.offset / 10) + 1;

		const sources = facets.reduce((prev, curr)=> {
			if (curr.facetName === 'Source') { return curr.data; }
			return prev;
		}, []);

		const fileTypes = facets.reduce((prev, curr)=> {
			if (curr.facetName === 'File Type') { return curr.data; }
			return prev;
		}, []);

		const dateRanges = facets.reduce((prev, curr)=> {
			if (curr.facetName === 'Date Range') { return curr.data; }
			return prev;
		}, []);
		return (
			<div className="search">
				<title>{decodeURIComponent(queryObject.q) || 'Search'} · Prior Art Archive</title>

				<div className="container">
					<div className="row">
						<div className="col-12">
							<form onSubmit={this.handleSearchSubmit}>
								<SearchBar
									queryValue={this.state.q}
									onQueryChange={this.handleSearchChange}
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
							<div className="results-content">
								{/* isLoading &&
									<div>
										{[1, 2, 3, 4].map((item)=> {
											return <SearchResult isLoading={true} key={`loading-${item}`} />;
										})}
									</div>
								*/}
								{isLoading &&
									<Spinner />
								}
								{isError &&
									<NonIdealState
										title="Error with Search"
										visual="bp3-icon-error"
									/>
								}
								{!isLoading && !isError && !resultItems.length &&
									<NonIdealState
										title="No Results"
										visual="bp3-icon-search"
									/>
								}
								{!isLoading && !isError && !!resultItems.length &&
									<div>
										<div>
											{resultItems.map((item)=> {
												return (
													<SearchResult data={item} key={item.url} />
												);
											})}
										</div>

										<div className="page-buttons">
											<div className="bp3-button-group">
												{!!this.state.offset &&
													<Button
														onClick={this.handlePreviousPage}
														text="Previous"
													/>
												}
												{this.calculationPagination(currentPage, numPages).map((item)=> {
													if (item === '...') {
														return (
															<Button
																key={item}
																className="bp3-disabled"
																text="..."
															/>
														);
													}
													return (
														<Button
															key={item}
															className={item === currentPage ? 'bp3-active' : ''}
															onClick={()=>{ this.setOffset((item - 1) * 10); }}
															text={item}
														/>
													);
												})}
												{currentPage !== numPages &&
													<Button
														onClick={this.handleNextPage}
														text="Next"
													/>
												}
											</div>
										</div>
									</div>
								}
							</div>
							{isLoading &&
								<div className="results-filters loading" />
							}
							{!isLoading && (!!resultItems.length || Object.keys(queryObject).length > 1) &&
								<div className="results-filters">
									<div className="filter-block">
										<h6>Sort</h6>
										<RadioGroup
											onChange={this.handleSortChange}
											selectedValue={this.state.sort}
										>
											<Radio label="Date" value="date" />
											<Radio label="Relevancy" value="relevancy" />
										</RadioGroup>
									</div>

									{/* <h5 className="filter-header">Filter</h5> */}
									{!!sources.length &&
										<div className="filter-block">
											<h6>Source</h6>
											{sources.map((item)=> {
												const key = item.key[0];
												const value = item.value[0];
												const sourceArray = this.state.source.split('+').filter((elem)=> { return !!elem; });
												const newSourceArray = sourceArray.indexOf(key) > -1
													? sourceArray.filter((elem)=> { return elem !== key; })
													: [...sourceArray, key];
												const onChange = ()=> {
													const newState = {
														...this.state,
														source: newSourceArray.join('+'),
													};
													this.updateUrl(newState);
												};
												return (
													<Checkbox
														checked={sourceArray.indexOf(key) > -1}
														label={
															<span className="option-wrapper">
																<span className="option-key">{key}</span>
																{value}
															</span>
														}
														onChange={onChange}
														key={`source-${key}`}
													/>
												);
											})}
										</div>
									}

									{!!fileTypes.length &&
										<div className="filter-block">
											<h6>File Type</h6>
											{fileTypes.map((item)=> {
												const key = item.key[0];
												const value = item.value[0];
												const fileArray = this.state.file.split('+').filter((elem)=> { return !!elem; });
												const newFileArray = fileArray.indexOf(key) > -1
													? fileArray.filter((elem)=> { return elem !== key; })
													: [...fileArray, key];
												const onChange = ()=> {
													const newState = {
														...this.state,
														file: newFileArray.join('+'),
													};
													this.updateUrl(newState);
												};
												return (
													<Checkbox
														checked={fileArray.indexOf(key) > -1}
														label={
															<span className="option-wrapper">
																<span className="option-key">{key}</span>
																{value}
															</span>
														}
														onChange={onChange}
														key={`file-${key}`}
													/>
												);
											})}
										</div>
									}

									{!!dateRanges.length &&
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
									}
								</div>
							}
						</div>
					</div>
				</div>

				<Footer />
			</div>
		);
	}
}

Search.propTypes = propTypes;
export default Search;

hydrateWrapper(Search);
