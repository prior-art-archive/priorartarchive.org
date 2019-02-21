import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/Avatar/Avatar';
import Icon from 'components/Icon/Icon';

require('./organizationHeader.scss');

const propTypes = {
	organizationData: PropTypes.object.isRequired,
	isOrganization: PropTypes.bool,
};

const defaultProps = {
	isOrganization: false,
};

const OrganizationHeader = function(props) {
	const links = [
		{
			id: 1,
			value: props.organizationData.website,
			icon: <Icon icon="link" />,
			href: props.organizationData.website,
		},
	];
	return (
		<div className="organization-header-component">
			<div className="avatar-wrapper">
				<Avatar
					userAvatar={props.organizationData.avatar}
					userInitials={props.organizationData.name.substring(0, 1)}
					width={150}
				/>
				{props.isOrganization && (
					<div>
						<a
							href={`/organization/${props.organizationData.slug}/edit`}
							className="bp3-button bp3-intent-primary"
						>
							Edit Profile
						</a>
					</div>
				)}
			</div>
			<div className="details">
				<h1>{props.organizationData.name}</h1>
				{props.organizationData.bio && (
					<div className="bio">{props.organizationData.bio}</div>
				)}
				<div className="links">
					{links
						.filter((link) => {
							return link.value;
						})
						.map((link) => {
							return (
								<a
									key={`link-${link.id}`}
									className={`bp3-button bp3-minimal ${
										!link.href ? 'no-click' : ''
									}`}
									href={link.href}
									rel="noopener noreferrer"
								>
									{link.icon}
									{link.value}
								</a>
							);
						})}
				</div>
			</div>
		</div>
	);
};

OrganizationHeader.defaultProps = defaultProps;
OrganizationHeader.propTypes = propTypes;
export default OrganizationHeader;
