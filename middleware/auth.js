const jwt = require('jsonwebtoken');
const User = require('../models/user');

const Roles = require('../enums/roles');

const requireAuth = (req, res, next) => {
	if (res.locals.user !== null) {
		next();
		return;
	}

	const token = req.cookies['jwt'];

	if (token) {
		jwt.verify(token, 'secret', (err, decodedToken) => {
			if (err) {
				console.log(err.message);
				res.redirect('/auth/sign-in');
			} else {
				console.log(decodedToken);
				next();
			}
		});
	} else {
		res.redirect('/auth/sign-in');
	}
};

const requireEditorRole = (req, res, next) => {
	const user = res.locals.user;
	const editorValidate = user.role === Roles.Editor;

	if (!editorValidate) {
		res.redirect('/');
	} else {
		next();
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

module.exports = { requireAuth, requireEditorRole, checkUser };