const express = require('express');
const News = require('./../models/news');
const Comment = require('./../models/comment');

const { requireAuth, requireEditorRole } = require("../middleware/auth");

const router = express.Router();

router
	.route('/edit/:sourceId')
	.get(requireAuth, async (req, res, next) => {
		const element = new Comment();
		req.source = await News.findById(req.params.sourceId);

		res.render('comment/edit', {
			title: "New",
			useID: false,
			element: element,
			source: req.source,
		});
	});

router
	.route('/edit/:sourceId/:id')
	.get(requireAuth, requireEditorRole, async (req, res, next) => {
		const element = await Comment.findById(req.params.id);
		req.source = await News.findById(req.params.sourceId);

		res.render('comment/edit', {
			title: "Edit",
			useID: true,
			element: element,
			source: req.source,
		});
	});

router
	.route('/:sourceId')
	.post(requireAuth, async (req, res, next) => {
		req.element = new Comment();
		req.source = await News.findById(req.params.sourceId);
		next();
	}, saveNewsAndRedirect('edit'));

router
	.route('/:sourceId/:id')
	.post(requireAuth, requireEditorRole, async (req, res, next) => {
		req.element =  await Comment.findById(req.params.id);
		req.source = await News.findById(req.params.sourceId);
		next();
	}, saveNewsAndRedirect('edit'));

function saveNewsAndRedirect(path) {
	return async (req, res) => {
		let element = req.element;
		element.authorId = res.locals.user.id;
		element.sourceId = req.source.id;
		element.text = req.body.text;
		try {
			element = await element.save();
			res.redirect(`/news/${req.source.id}/`);
		} catch (e) {
			res.redirect(`/comment/${path}/${res.source.id}/${element.id}`);
		}
	}
}

module.exports = router;
