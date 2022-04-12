const express = require('express');
const News = require('../models/news');

const router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
// 	res.render('index', { title: 'Express' });
// });

router
	.route('/')
	.get(async (req, res, next) => {
		const news = await News.find();
		const user = res.locals.user;
		res.render('index', {
			news: news,
			user: user,
			title: 'Home Page'
		});
	});

module.exports = router;
