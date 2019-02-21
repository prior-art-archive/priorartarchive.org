import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Icon } from '@blueprintjs/core';

import { operators } from '../../utilities';

require('./searchBar.scss');

const propTypes = {
	queryValue: PropTypes.string.isRequired,
	onQueryChange: PropTypes.func.isRequired,
	operatorValue: PropTypes.string.isRequired,
	onOperatorChange: PropTypes.func.isRequired,
};

const SearchBar = function(props) {
	return (
		<div className="search-bar-wrapper">
			<div className="bp3-control-group bp3-large">
				<div className="bp3-input-group bp3-fill bp3-large">
					<Icon icon="search" />
					<input
						placeholder="Search..."
						value={props.queryValue}
						onChange={props.onQueryChange}
						className="bp3-input"
					/>
				</div>
			</div>
			<button type="button" className="bp3-button bp3-intent-primary">
				Search
			</button>
			<div className="bp3-select bp3-large">
				<select value={props.operatorValue} onChange={props.onOperatorChange}>
					{operators.map((item) => {
						return (
							<option value={item} key={`operator-${item}`}>
								{item}
							</option>
						);
					})}
				</select>
				<Icon icon="double-caret-vertical" />
			</div>
			<Tooltip content="History">
				<a href="/history" className="bp3-button bp3-large history-button">
					<Icon icon="history" />
				</a>
			</Tooltip>
		</div>
	);
};

SearchBar.propTypes = propTypes;
export default SearchBar;
