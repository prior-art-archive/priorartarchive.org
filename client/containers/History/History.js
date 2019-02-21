import React, { Component } from 'react';
import PropTypes from 'prop-types';
import store from 'store/dist/store.legacy';
import { Button, NonIdealState, HTMLTable } from '@blueprintjs/core';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

require('./history.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

class History extends Component {
	constructor() {
		super();
		this.state = {
			searchHistory: [],
		};
		this.clearHistory = this.clearHistory.bind(this);
	}

	componentDidMount() {
		this.setState({
			searchHistory: store.get('searchHistory') || [],
		});
	}

	clearHistory() {
		store.clearAll();
		this.setState({ searchHistory: [] });
	}

	render() {
		const searchHistory = this.state.searchHistory;
		return (
			<div id="history-container">
				<PageWrapper
					loginData={this.props.loginData}
					locationData={this.props.locationData}
				>
					<div className="container">
						<div className="row">
							<div className="col-12">
								{!!searchHistory.length && (
									<div className="button-wrapper">
										<Button onClick={this.clearHistory} text="Clear History" />
									</div>
								)}

								<h1>History</h1>
								{!!searchHistory.length && (
									<p>
										Your search history is stored locally in your browser.
										Clearing your history is permanent.
									</p>
								)}
								{!searchHistory.length && (
									<NonIdealState title="Search History Empty" visual="history" />
								)}
								{!!searchHistory.length && (
									<HTMLTable striped={true} interactive={true}>
										<thead>
											<tr>
												<th>Search Number</th>
												<th>Search String</th>
												<th>Timestamp</th>
												<th>Total Hits</th>
												<th>Operator</th>
												<th>Sources</th>
											</tr>
										</thead>
										<tbody>
											{searchHistory
												.sort((foo, bar) => {
													if (foo.searchedAt < bar.searchedAt) {
														return 1;
													}
													if (foo.searchedAt > bar.searchedAt) {
														return -1;
													}
													return 0;
												})
												.map((item, index) => {
													return (
														<tr key={item.searchedAt}>
															<td>{searchHistory.length - index}</td>
															<td>{item.query}</td>
															<td>
																{new Date(
																	item.searchedAt,
																).toString()}
															</td>
															<td>{item.totalHits}</td>
															<td>{item.operator}</td>
															<td>{item.sources}</td>
														</tr>
													);
												})}
										</tbody>
									</HTMLTable>
								)}
							</div>
						</div>
					</div>
				</PageWrapper>
			</div>
		);
	}
}

History.propTypes = propTypes;
export default History;

hydrateWrapper(History);
