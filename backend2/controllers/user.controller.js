const db = require("../models");
const User = db.user;

exports.allAccess = (req, res) => {
	res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
	res.status(200).send("User Content of " + req.params.user);
};
exports.vote = (req, res) => {
	User.findOne({ username: req.params.user }).exec((err, user) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}
		if (user) {
			res.status(200).send({
				vote: user.vote,
			});
			return;
		}
		res.status(404).send("not found");
	});
};

exports.newLike = (req, res) => {
	const like = req.body;
	if (like.receiver !== like.sender && typeof like.vote == "number" && like.vote>0 && like.vote<=10){
		Promise.all([
			User.findOne({ username: like.receiver }).exec(),
			User.findOne({ username: like.sender }).exec(),
		])
			.then(([user1, user2]) => {
				const other_points = user2.vote;
				const nw = user1.ow + other_points;
				const points =
					(user1.vote * user1.ow) / nw +
					(other_points * parseInt(like.vote)) / nw;

				const ow = nw;
				return User.updateOne(
					{ username: like.receiver },
					{ vote: points, ow: ow }
				).exec();
			})
			.then(() => {
				res.status(201).send(like);
			})
			.catch(() => {
				res.status(500).send("error");
			});
	} else{
	res.status(400).send("bad request, receiver and sender should be different, vote a number between 1 and 10");
};
