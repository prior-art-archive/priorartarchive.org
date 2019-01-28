require('./landing');				// Route: '/'
require('./about');					// Route: '/about'
require('./document');				// Route: '/doc/:id'
require('./login'); 				// Route: '/login'
require('./organizationCreate'); 	// Route: '/organization/create/:hash'
require('./organization'); 			// Route: ['/organization/:slug', '/organization/:slug/:mode']
require('./passwordReset'); 		// Route: ['/password-reset', '/password-reset/:resetHash/:slug']
require('./privacy'); 				// Route: '/privacy'
require('./search'); 				// Route: '/search'
require('./signup'); 				// Route: '/signup'
require('./terms'); 				// Route: '/tos'
require('./noMatch');				// Route: '/*'
