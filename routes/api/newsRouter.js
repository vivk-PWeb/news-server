const express = require("express");

const Permissions = require("../../enums/permissions");
const News = require("../../models/news");

const newsRouter = express.Router();

newsRouter
	.route("/")
	.get((req, res, next) =>{
		News.find({})
			.then(
				news => {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.json(news);
				},
				err => next(err),
			)
			.catch(err => next(err));
	})
	.post((req, res, next) => {
		News.create(req.body)
			.then(
				news => {
					console.log('News Created ', news);
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(news);
				},
				err => next(err)
			)
			.catch(err => next(err));
	})
	.put((req, res, next) => {
		req.statusCode = 403;
		res.end('PUT operation not supported on /news');
	})
	.delete((req, res, next) => {
		News.remove({})
			.then(
				response => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(response);
				},
				err => next(err),
			)
			.catch(err => next(err));
	});

newsRouter
	.route("/:id")
	.get((req, res, next) =>{
		News.findById(req.params.id)
			.then(
				news => {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.json(news);
				},
				err => next(err),
			)
			.catch(err => next(err));
	})
	.post((req, res, next) => {
		req.statusCode = 403;
		res.end(`POST operation not supported on /news/${req.params.id}`);
	})
	.put((req, res, next) => {
		News.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true })
			.then(news => {
				console.log('News Updated ', news);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(news);
			},
			err => next(err))
			.catch(err => next(err));
	})
	.delete((req, res, next) => {
		News.findByIdAndRemove(req.params.id)
			.then(
				response => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(response);
				},
				err => next(err),
			)
			.catch(err => next(err));
	});

module.exports = newsRouter;