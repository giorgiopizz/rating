const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

const User = mongoose.model(
	"User",
	new mongoose.Schema({
		username: String,
		email: String,
		password: String,
		vote: Number,
		ow: Number,
	})
);

db.user = User;

module.exports = db;
