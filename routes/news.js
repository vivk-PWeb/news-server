const express = require('express');
const News = require('./../models/news');
const Comment = require('./../models/comment');
const User = require("../models/user");

const Permissions = require('../enums/permissions');
const { requireAuth, requireEditorRole } = require("../middleware/auth");

const router = express.Router();

router
	.route('/edit')
	.get(requireAuth, requireEditorRole, (req, res, next) => {
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
	.get(requireAuth, requireEditorRole, async (req, res, next) => {
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
		res.element = await News.findById(req.params.id);

		const privateValidate = res.element.permission === Permissions.Private;
		if (privateValidate) {
			requireAuth(req, res, next);
		} else {
			next();
		}
	}, async (req, res, next) => {
		const element = res.element;

		const protectedValidate = element.permission === Permissions.Protected;
		const passwordValidate = req.cookies[element.id] === element.password;

		if (protectedValidate && !passwordValidate) {
			res.redirect(`/news/protected/${element.id}`);
		} else {
			const comments = await Comment
				.find({ sourceId: element.id })
				.sort({createdAt: -1});
			for (let index = 0; index < comments.length; index++) {
				comments[index].author = await User.findById(comments[index].authorId);
			}

			res.render('news/show', {
				title: "Show",
				element: element,
				comments: comments,
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
	.post(requireAuth, requireEditorRole, (req, res, next) => {
		req.element = new News();
		next();
	}, saveNewsAndRedirect('edit'));

router
	.route('/:id')
	.post(requireAuth, requireEditorRole, async (req, res, next) => {
		req.element =  await News.findById(req.params.id);
		next();
	}, saveNewsAndRedirect('edit'));

router
	.route('/delete/:id')
	.post(requireAuth, requireEditorRole, async (req, res, next) => {
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