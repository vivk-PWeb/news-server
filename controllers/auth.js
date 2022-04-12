const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
	return jwt.sign(
		{ id },
		'secret',
		{ expiresIn: maxAge }
	);
};

const saveTokenCookie = (token, res) => {
	res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
};

module.exports = { createToken, saveTokenCookie };
