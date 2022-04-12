const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuth = (req, res, next) => {
	const token = req.cookies['jwt'];

	if (token) {
		jwt.verify(token, 'secret', (err, decodedToken) => {
			if (err) {
				console.log(err.message);
				res.redirect('/sign-in');
			} else {
				console.log(decodedToken);
				next();
			}
		});
	} else {
		res.redirect('/sign-in');
	}
};

const checkUser = (req, res, next) => {
	const token = req.cookies['jwt'];
	if (token) {
		jwt.verify(token, 'secret', async (err, decodedToken) => {
			if (err) {
				res.locals.user = null;
				next();
			} else {
				res.locals.user = await User.findById(decodedToken.id);
				next();
			}
		});
	} else {
		res.locals.user = null;
		next();
	}
};

module.exports = { requireAuth, checkUser };