const mongoose = require("mongoose");
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

const News = mongoose.model("News", newsSchema);

module.exports = News;