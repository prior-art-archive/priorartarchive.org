import mailgun from 'mailgun.js';
import stripIndent from 'strip-indent';

const mg = mailgun.client({
	username: 'api',
	key: process.env.MAILGUN_API_KEY,
});

export const sendPasswordResetEmail = ({ toEmail, resetUrl }) => {
	return mg.messages.create('mg.priorartarchive.org', {
		from: 'Prior Art Archive Team <team@priorartarchive.org>',
		to: [toEmail],
		subject: 'Password Reset · Prior Art Archive',
		text: stripIndent(`
			We've received a password reset request. Follow the link below to reset your password.

			${resetUrl}

			Sincerely,
			Prior Art Archive Team
		`),
	});
};

export const sendSignupEmail = ({ toEmail, signupUrl }) => {
	return mg.messages.create('mg.priorartarchive.org', {
		from: 'Prior Art Archive Team <team@priorartarchive.org>',
		to: [toEmail],
		subject: 'Welcome to the Prior Art Archive!',
		text: stripIndent(`
			Welcome to the Prior Art Archive!
			
			Click the following link to create your account:

			${signupUrl}

			Sincerely,
			Prior Art Archive Team
		`),
	});
};
