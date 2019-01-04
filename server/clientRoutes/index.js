require('./landing');				// Route: '/'
require('./about');					// Route: '/about'
require('./login'); 				// Route: '/login'
require('./organizationCreate'); 	// Route: '/organization/create/:hash'
require('./organization'); 			// Route: ['/organization/:slug', '/organization/:slug/:mode']
require('./privacy'); 				// Route: '/privacy'
require('./search'); 				// Route: '/search'
require('./signup'); 				// Route: '/signup'
require('./terms'); 				// Route: '/tos'
require('./passwordReset'); 		// Route: ['/password-reset', '/password-reset/:resetHash/:slug']
require('./noMatch');				// Route: '/*'
