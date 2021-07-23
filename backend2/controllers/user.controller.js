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

// const newLikeHandle = (like) => {

// 	Promise.all([
// 		User.findOne({ username: like.receiver }).exec(),
// 		User.findOne({ username: like.sender }).exec()
// 	]).then( ([ user1, user2 ]) => {
// 		const other_points = user2.vote;
// 		const nw = user1.ow + other_points;
// 		const points =
// 			(user1.vote * user1.ow) / nw +
// 			(other_points * parseInt(like.vote)) / nw;

// 		const ow = nw;
// 		return User.updateOne(
// 			{ username: like.receiver },
// 			{ vote: points, ow: ow }).exec();
// 	})
// 	.then(()=>{

// 	})

// 	, (err1, user1) => {
// 		if (err1) {
// 			console.log("receiver not found");
// 			return false;
// 		}

// 		if (user1) {
// 			User.findOne({ username: like.sender }, (err2, user2) => {
// 				if (err2) {
// 					console.log("sender not found");
// 					return false;
// 				}

// 				if (user2) {
// 					const other_points = user2.vote;
// 					const nw = user1.ow + other_points;
// 					const points =
// 						(user1.vote * user1.ow) / nw +
// 						(other_points * parseInt(like.vote)) / nw;

// 					const ow = nw;
// 					User.updateOne(
// 						{ username: like.receiver },
// 						{ vote: points, ow: ow },
// 						(err, result) => {
// 							if (err) {
// 								console.log("errore nel salvataggio");
// 								return false;
// 							}

// 							if (result) {
// 								console.log("voto aggiornato");
// 								return true;
// 							}
// 						}
// 					);
// 				}
// 			});
// 		}
// 	});
// };

exports.newLike = (req, res) => {
	const like = req.body;
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
};
