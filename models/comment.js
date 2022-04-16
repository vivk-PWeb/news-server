const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const commentScheme = new Schema({
	sourceId: {
		type: ObjectId,
		required: true
	},
	authorId: {
		type: ObjectId,
		required: true
	},
	text: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const Comment = mongoose.model("Comment", commentScheme);

module.exports = Comment;
