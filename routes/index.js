const express = require('express');
const News = require('../models/news');

const Permissions = require('../enums/permissions');
const Roles = require('../enums/roles');

const router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
// 	res.render('index', { title: 'Express' });
// });

router
	.route('/')
	.get(async (req, res, next) => {
		const news = await News.find().sort({createdAt: -1});
		const user = res.locals.user;

		if (user === null) {
			for (let index in news) {
				if (news[index].permission === Permissions.Private) {
					delete news[index];
				}
			}
		}

		res.render('index', {
			news: news,
			user: user,
			roles: Roles,
			title: 'Home Page'
		});
	});

module.exports = router;
