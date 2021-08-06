const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});

	app.get("/api/test/all", controller.allAccess);

	app.get("/api/test/user/:user", authJwt, controller.userBoard);

	app.get("/api/test/vote/:user", controller.vote);
	app.post("/api/test/newlike", authJwt, controller.newLike);
};
