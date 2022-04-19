const mongoose = require("mongoose");

const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const domPurify = createDomPurify(new JSDOM().window);
const { marked } = require('marked');

const Permissions = require("../enums/permissions");
const Schema = mongoose.Schema;

const newsSchema = new Schema({
	header: {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String
	},
	text: {
		type: String,
		required: true
	},
	sanitizedHtml: {
		type: String,
		required: true
	},
	permission: {
		type: String,
		enum: Object.values(Permissions),
		default: Permissions.Public
	},
	password: {
		type: String,
		default: ''
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
});

newsSchema
	.pre('validate', function(next) {
	if (this.text) {
		const markedText = marked(this.text);
		this.sanitizedHtml = domPurify.sanitize(markedText);
	}
	next();
})

const News = mongoose.model("News", newsSchema);

module.exports = News;