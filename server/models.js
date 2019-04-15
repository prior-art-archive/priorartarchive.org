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

const Organization = sequelize.define('Organization', {
	id: id,
	slug: {
		type: Sequelize.TEXT,
		unique: true,
		allowNull: false,
		validate: {
			isLowercase: true,
			len: [1, 280],
			is: /^[a-zA-Z0-9-]+$/, // Alphanumeric and hyphens
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
		},
	},
	website: { type: Sequelize.TEXT },
	isAuthenticated: { type: Sequelize.BOOLEAN },
	resetHashExpiration: { type: Sequelize.DATE },
	resetHash: { type: Sequelize.TEXT },
	hash: { type: Sequelize.TEXT, allowNull: false },
	salt: { type: Sequelize.TEXT, allowNull: false },
});

passportLocalSequelize.attachToUser(Organization, {
	usernameField: 'slug',
	hashField: 'hash',
	saltField: 'salt',
	digest: 'sha512',
	iterations: 25000,
});

const Document = sequelize.define('Document', {
	id: id,
	title: { type: Sequelize.TEXT },
	description: { type: Sequelize.TEXT },
	fileUrl: { type: Sequelize.TEXT },
	contentType: { type: Sequelize.TEXT },
	organizationId: { type: Sequelize.UUID, allowNull: false },
	cpcCodes: { type: Sequelize.ARRAY(Sequelize.TEXT) },
	language: { type: Sequelize.TEXT },
	publicationDate: { type: Sequelize.DATE },
});

const Assertion = sequelize.define('Assertion', {
	id: id,
	documentId: { type: Sequelize.UUID, allowNull: false },
	organizationId: { type: Sequelize.UUID, allowNull: false },
	cid: { type: Sequelize.TEXT },
	fileCid: { type: Sequelize.TEXT },
	fileName: { type: Sequelize.TEXT },
});

const Signup = sequelize.define('Signup', {
	id: id,
	email: {
		type: Sequelize.TEXT,
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true,
			isLowercase: true,
		},
	},
	hash: { type: Sequelize.TEXT },
	count: { type: Sequelize.INTEGER },
	completed: { type: Sequelize.BOOLEAN },
});

/* Organizations have many Documents. Documents belong to a single Organization */
Organization.hasMany(Document, {
	onDelete: 'CASCADE',
	as: 'documents',
	foreignKey: 'organizationId',
});
Document.belongsTo(Organization, {
	onDelete: 'CASCADE',
	as: 'organization',
	foreignKey: 'organizationId',
});

const db = {
	Organization: Organization,
	Document: Document,
	Assertion: Assertion,
	Signup: Signup,
};

db.sequelize = sequelize;

module.exports = db;
