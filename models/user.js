const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const Roles = require("../enums/roles");

const userSchema = new Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true,
		require: [true, 'Email is required!'],
		validate: [isEmail, 'Email is not valid!']
	},
	password: {
		type: String,
		minlength: [12, 'Password\'s minimal length is 12'],
		require: [true, 'Password is required!']
	},
	role: {
		type: String,
		enum: Object.values(Roles),
		default: Roles.Reader
	},
});

userSchema.pre('save', async function(next) {
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

userSchema.statics.login = async function(email, password) {
	const user = await this.findOne({ email });
	if (user) {
		const auth = await bcrypt.compare(password, user.password);
		if (auth) {
			return user;
		}
		throw Error('Incorrect password!');
	}
	throw Error('Incorrect email!');
};

const User =  mongoose.model("User", userSchema);

module.exports = User;

