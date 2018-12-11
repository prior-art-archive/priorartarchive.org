/* eslint-disable global-require */

if (process.env.NODE_ENV !== 'production') {
	require('./config.js');
}

const Sequelize = require('sequelize');
const passportLocalSequelize = require('passport-local-sequelize');

const operatorsAliases = {
	$or: Sequelize.Op.or,
	$and: Sequelize.Op.and,
	$ilike: Sequelize.Op.iLike,
	$in: Sequelize.Op.in,
	$not: Sequelize.Op.not,
	$eq: Sequelize.Op.eq,
	$ne: Sequelize.Op.ne,
	$lt: Sequelize.Op.lt,
	$gt: Sequelize.Op.gt,
};
const useSSL = process.env.DATABASE_URL.indexOf('localhost:') === -1;
const sequelize = new Sequelize(process.env.DATABASE_URL, {
	logging: false,
	dialectOptions: { ssl: useSSL },
	operatorsAliases: operatorsAliases,
});

// Change to true to update the model in the database.
// NOTE: This being set to true will erase your data.
sequelize.sync({ force: false });

const id = {
	primaryKey: true,
	type: Sequelize.UUID,
	defaultValue: Sequelize.UUIDV4,
};

// const Upload = sequelize.define('Upload', {
// 	id: id,
// 	rawMetadata: { type: Sequelize.JSONB },
// 	formattedMetadata: { type: Sequelize.JSONB },
// 	underlayMetadata: { type: Sequelize.JSONB },
// 	organizationId: { type: Sequelize.UUID },
// 	deleted: { type: Sequelize.BOOLEAN },
// 	requestId: {
// 		type: Sequelize.UUID,
// 		unique: true,
// 	},
// });

const Asset = sequelize.define('Asset', {
	id: id,
	url: { type: Sequelize.TEXT },
	originalFilename: { type: Sequelize.TEXT },
	title: { type: Sequelize.TEXT },
	description: { type: Sequelize.TEXT },
	datePublished: { type: Sequelize.TEXT },
	md5Hash: {
		type: Sequelize.TEXT,
		allowNull: false,
		unique: true,
	},
	sourcePath: { type: Sequelize.TEXT },
	/* Set by Associations */
	companyId: { type: Sequelize.UUID, allowNull: false },
});

const Company = sequelize.define('Company', {
	id: id,
	slug: {
		type: Sequelize.TEXT,
		unique: true,
		allowNull: false,
		validate: {
			isLowercase: true,
			len: [1, 280],
			is: /^(?=.*[a-zA-Z])[a-zA-Z0-9-]+$/, // Must contain at least one letter, alphanumeric and underscores and hyphens
		},
	},
	name: { type: Sequelize.TEXT, allowNull: false },
	avatar: { type: Sequelize.TEXT },
	bio: { type: Sequelize.TEXT },
	email: {
		type: Sequelize.TEXT,
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true,
			isLowercase: true,
		}
	},
	location: { type: Sequelize.TEXT },
	website: { type: Sequelize.TEXT },
	hash: { type: Sequelize.TEXT, allowNull: false },
	salt: { type: Sequelize.TEXT, allowNull: false },
});

const User = sequelize.define('User', {
	id: id,
	slug: {
		type: Sequelize.TEXT,
		unique: true,
		allowNull: false,
		validate: {
			isLowercase: true,
			len: [1, 280],
			is: /^[a-zA-Z0-9-]+$/, // Must contain at least one letter, alphanumeric and underscores and hyphens
		},
	},
	firstName: { type: Sequelize.TEXT, allowNull: false },
	lastName: { type: Sequelize.TEXT, allowNull: false },
	fullName: { type: Sequelize.TEXT, allowNull: false },
	initials: { type: Sequelize.STRING, allowNull: false },
	avatar: { type: Sequelize.TEXT },
	bio: { type: Sequelize.TEXT },
	title: { type: Sequelize.TEXT },
	email: {
		type: Sequelize.TEXT,
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true,
			isLowercase: true,
		}
	},
	publicEmail: {
		type: Sequelize.TEXT,
		validate: {
			isEmail: true,
			isLowercase: true,
		}
	},
	location: { type: Sequelize.TEXT },
	website: { type: Sequelize.TEXT },
	facebook: { type: Sequelize.TEXT },
	twitter: { type: Sequelize.TEXT },
	github: { type: Sequelize.TEXT },
	orcid: { type: Sequelize.TEXT },
	googleScholar: { type: Sequelize.TEXT },
	resetHashExpiration: { type: Sequelize.DATE },
	resetHash: { type: Sequelize.TEXT },
	inactive: { type: Sequelize.BOOLEAN },
	passwordDigest: { type: Sequelize.TEXT },
	hash: { type: Sequelize.TEXT, allowNull: false },
	salt: { type: Sequelize.TEXT, allowNull: false },
});

passportLocalSequelize.attachToUser(User, {
	usernameField: 'email',
	hashField: 'hash',
	saltField: 'salt',
	digest: 'sha512',
	iterations: 25000,
});

/* Companies have many Assets. Recipes belong to a single Community */
Company.hasMany(Asset, { onDelete: 'CASCADE', as: 'assets', foreignKey: 'companyId' });
Asset.belongsTo(Company, { onDelete: 'CASCADE', as: 'company', foreignKey: 'companyId' });

const db = {
	Asset: Asset,
	User: User,
	Company: Company,
};

db.sequelize = sequelize;

module.exports = db;
