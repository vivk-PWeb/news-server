const express = require('express');
const News = require('./../models/news');
const Permissions = require('../enums/permissions');

const router = express.Router();

router
	.route('/edit')
	.get((req, res, next) => {
		const element = new News();
		res.render('news/edit', {
			title: "New",
			useID: false,
			element: element,
			permissions: Permissions
		});
	});

router
	.route('/edit/:id')
	.get(async (req, res, next) => {
		const element = await News.findById(req.params.id);
		res.render('news/edit', {
			title: "Edit",
			useID: true,
			element: element,
			permissions: Permissions
		});
	});

router
	.route('/:id')
	.get(async (req, res, next) => {
		const element = await News.findById(req.params.id);

		const protectedValidate = element.permission === Permissions.Protected;
		const passwordValidate = req.cookies[element.id] === element.password;

		if (protectedValidate && !passwordValidate) {
			res.redirect(`/news/protected/${element.id}`);
		} else {
			res.render('news/show', {
				title: "Show",
				element: element
			});
		}
	});

router
	.route('/protected/:id')
	.get(async (req, res, next) => {
		const element = await News.findById(req.params.id);

		res.render('news/protected', {
			title: "Protected",
			element: element
		});
	});

router
	.route('/protected-validate/:id/')
	.post(async (req, res, next) => {
		const element = await News.findById(req.params.id);
		const password = req.body.password;

		const protectedValidate = element.permission === Permissions.Protected;
		if (!protectedValidate) {
			res.redirect(`/news/${element.id}`);
			return;
		}

		const passwordValidate = element.password === password;
		if (passwordValidate) {
			saveCookie(element.id, element.password, res);
			res.redirect(`/news/${element.id}`);
		} else {
			res.render('news/protected', {
				title: "Protected",
				element: element
			});
		}
	});


router
	.route('/')
	.post((req, res, next) => {
		req.element = new News();
		next();
	}, saveNewsAndRedirect('edit'));

router
	.route('/:id')
	.post(async (req, res, next) => {
		req.element =  await News.findById(req.params.id);
		next();
	}, saveNewsAndRedirect('edit'));

router
	.route('/delete/:id')
	.post(async (req, res, next) => {
		req.element =  await News.findByIdAndDelete(req.params.id);
		res.redirect('/');
	});

function saveNewsAndRedirect(path) {
	return async (req, res) => {
		let element = req.element;
		element.header = req.body.header;
		element.description = req.body.description;
		element.text = req.body.text;
		element.permission = req.body.permission;
		element.password = req.body.password;
		saveCookie(element.id, element.password, res);
		try {
			element = await element.save();
			res.redirect(`/news/${element.id}`);
		} catch (e) {
			res.render(`news/${path}`, { article: element });
		}
	}
}

function saveCookie(key, value, res) {
	const options = {
		expires: new Date(Date.now() + 900000),
		httpOnly: true
	};
	res.cookie(key, value, options);
}

module.exports = router;