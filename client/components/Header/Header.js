import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/Avatar/Avatar';
import {
	Popover,
	PopoverInteractionKind,
	Position,
	Menu,
	MenuItem,
	MenuDivider,
	Button,
} from '@blueprintjs/core';
import { apiFetch } from 'utilities';

require('./header.scss');

const propTypes = {
	locationData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
};

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.handleLogout = this.handleLogout.bind(this);
	}

	handleLogout() {
		apiFetch('/api/logout').then(() => {
			window.location.href = '/';
		});
	}

	render() {
		const loggedIn = !!this.props.loginData.slug;
		const isHome = this.props.locationData.path === '/';
		const redirectString = `?redirect=${this.props.locationData.path}${
			this.props.locationData.queryString.length > 1
				? this.props.locationData.queryString
				: ''
		}`;

		return (
			<nav className={`header-component ${isHome ? 'simple' : ''}`}>
				<div className="container">
					<div className="row">
						<div className="col-12">
							{/* App Logo - do not show on homepage */}

							<div className="headerItems headerItemsLeft">
								{!isHome && (
									<a
										href="/"
										className="headerLogo bp3-button bp3-large bp3-minimal"
									>
										Prior Art Archive
									</a>
								)}
							</div>

							<div className="headerItems headerItemsRight">
								{/* User avatar and menu */}
								<a href="/help" className="bp3-button bp3-large bp3-minimal">
									Help
								</a>
								<a href="/terms" className="bp3-button bp3-large bp3-minimal">
									Terms
								</a>
								<a href="/about" className="bp3-button bp3-large bp3-minimal">
									About
								</a>
								{loggedIn && (
									<Popover
										content={
											<Menu>
												<li>
													<a
														href={`/organization/${
															this.props.loginData.slug
														}`}
														className="bp3-menu-item bp3-popover-dismiss"
													>
														<div>{this.props.loginData.name}</div>
														<div className="subtext">View Profile</div>
													</a>
												</li>
												<MenuDivider />
												<MenuItem
													text="Logout"
													onClick={this.handleLogout}
												/>
											</Menu>
										}
										interactionKind={PopoverInteractionKind.CLICK}
										position={Position.BOTTOM_RIGHT}
										transitionDuration={-1}
										inheritDarkTheme={false}
									>
										<Button className="bp3-button bp3-large bp3-minimal avatar-button">
											<Avatar
												userInitials={this.props.loginData.name.substring(
													0,
													1,
												)}
												userAvatar={this.props.loginData.avatar}
												width={30}
											/>
										</Button>
									</Popover>
								)}

								{/* Login or Signup button */}
								{!loggedIn && (
									<a
										href={`/login${redirectString}`}
										className="bp3-button bp3-large bp3-intent-primary"
									>
										Login
									</a>
								)}
							</div>
						</div>
					</div>
				</div>
			</nav>
		);
	}
}

Header.propTypes = propTypes;
export default Header;
