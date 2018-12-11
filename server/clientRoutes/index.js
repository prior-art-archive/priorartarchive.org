require('./landing');			// Route: '/'
require('./about');				// Route: '/about'
require('./login'); 			// Route: '/login'
require('./privacy'); 			// Route: '/privacy'
require('./search'); 			// Route: '/search'
require('./signup'); 			// Route: '/signup'
require('./terms'); 			// Route: '/tos'
require('./passwordReset'); 	// Route: ['/password-reset', '/password-reset/:resetHash/:slug']
require('./userCreate'); 		// Route: '/user/create/:hash'
require('./user'); 				// Route: ['/user/:slug', '/user/:slug/:mode']
require('./noMatch');			// Route: '/*'
