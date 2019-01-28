import passport from 'passport';
import app from '../server';

app.post('/api/login', passport.authenticate('local'), (req, res)=> {
	return res.status(200).json('success');
});
