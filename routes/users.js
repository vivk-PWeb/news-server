const express = require('express');
const router = express.Router();

const User = require('../models/user');

const { createToken, saveTokenCookie } = require('../controllers/auth')

router
	.get('/sign-in', async (req, res, next) => {
		res.render('user/auth', {
			title: "Sign-In",
			authUrl: "/sign-in"
		});
	});

router
	.get('/sign-up', async (req, res, next) => {
		res.render('user/auth', {
			title: "Sign-Up",
			authUrl: "/sign-up"
		});
	});

router
	.get('/sign-out', async (req, res, next) => {
		res.clearCookie('jwt');
		res.redirect('/');
	});

router
	.post('/sign-in', async (req, res, next) => {
		const email = req.body.email;
		const password = req.body.password;

		try {
			const user = await User.login(email, password);
			const token = createToken(user.id);
			saveTokenCookie(token, res);
			res.redirect('/');
		} catch (e) {
			res.redirect('/auth/sign-in');
		}
	});

router
	.post('/sign-up', async (req, res, next) => {
		let user = new User();
		user.email = req.body.email;
		user.password = req.body.password;

		try {
			user = await user.save();
			const token = createToken(user.id);
			saveTokenCookie(token, res);
			res.redirect('/');
		} catch (e) {
			res.redirect('/auth/sign-up');
		}
	});

module.exports = router;
