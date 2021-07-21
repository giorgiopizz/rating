const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const crypto = require("crypto");
const LocalStrategy = require("passport-local").Strategy;
const cors = require("cors");
require("dotenv").config();

const MongoStore = require("connect-mongo");

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const conn = process.env.DB_STRING;
const connection = mongoose.createConnection(conn, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

connection.on("connecting", () => {
	console.log("Connected to db");
});

const UserSchema = new mongoose.Schema({
	username: String,
	hash: String,
	salt: String,
});

const User = mongoose.model("User", UserSchema);

passport.use(
	new LocalStrategy(function (username, password, cb) {
		User.findOne({ username: username })
			.then((user) => {
				if (!user) {
					return cb(null, false);
				}

				// Function defined at bottom of app.js
				const isValid = validPassword(password, user.hash, user.salt);

				if (isValid) {
					return cb(null, user);
				} else {
					return cb(null, false);
				}
			})
			.catch((err) => {
				cb(err);
			});
	})
);

/**
 * This function is used in conjunction with the `passport.authenticate()` method.  See comments in
 * `passport.use()` above ^^ for explanation
 */
passport.serializeUser(function (user, cb) {
	cb(null, user.id);
});

/**
 * This function is used in conjunction with the `app.use(passport.session())` middleware defined below.
 * Scroll down and read the comments in the PASSPORT AUTHENTICATION section to learn how this works.
 *
 * In summary, this method is "set" on the passport object and is passed the user ID stored in the `req.session.passport`
 * object later on.
 */
passport.deserializeUser(function (id, cb) {
	User.findById(id, function (err, user) {
		if (err) {
			return cb(err);
		}
		cb(null, user);
	});
});

const sessionStore = new MongoStore({
	mongooseConnection: connection,
	collection: "sessions",
});

app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: true,
		store: sessionStore,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24,
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res, next) => {
	res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
app.get("/login", (req, res, next) => {
	const form =
		'<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

	res.send(form);
});

// Since we are using the passport.authenticate() method, we should be redirected no matter what
app.post(
	"/login",
	passport.authenticate("local", {
		failureRedirect: "/login-failure",
		successRedirect: "login-success",
	}),
	(err, req, res, next) => {
		if (err) next(err);
	}
);

// When you visit http://localhost:3000/register, you will see "Register Page"
app.get("/register", (req, res, next) => {
	const form =
		'<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

	res.send(form);
});

app.post("/register", (req, res, next) => {
	const saltHash = genPassword(req.body.password);

	const salt = saltHash.salt;
	const hash = saltHash.hash;

	const newUser = new User({
		username: req.body.username,
		hash: hash,
		salt: salt,
	});

	newUser.save().then((user) => {
		console.log(user);
	});

	res.redirect("/login");
});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 *
 * Also, look up what behaviour express session has without a maxage set
 */
app.get("/protected-route", (req, res, next) => {
	// This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
	if (req.isAuthenticated()) {
		res.send(
			'<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>'
		);
	} else {
		res.send(
			'<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>'
		);
	}
});

// Visiting this route logs the user out
app.get("/logout", (req, res, next) => {
	req.logout();
	res.redirect("/protected-route");
});

app.get("/login-success", (req, res, next) => {
	res.send(
		'<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
	);
});

app.get("/login-failure", (req, res, next) => {
	res.send("You entered the wrong password.");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

/**
 * -------------- HELPER FUNCTIONS ----------------
 */

/**
 *
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function validPassword(password, hash, salt) {
	var hashVerify = crypto
		.pbkdf2Sync(password, salt, 10000, 64, "sha512")
		.toString("hex");
	return hash === hashVerify;
}

/**
 *
 * @param {*} password - The password string that the user inputs to the password field in the register form
 *
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 *
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
function genPassword(password) {
	var salt = crypto.randomBytes(32).toString("hex");
	var genHash = crypto
		.pbkdf2Sync(password, salt, 10000, 64, "sha512")
		.toString("hex");

	return {
		salt: salt,
		hash: genHash,
	};
}

// const mongoose = require("mongoose");
// const url =
// 	"mongodb+srv://fullstackopen:blablacarsti@cluster0.cqjoy.mongodb.net/rating?retryWrites=true&w=majority";

// console.log("connecting to", url);
// mongoose
// 	.connect(url, {
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true,
// 		useFindAndModify: false,
// 		useCreateIndex: true,
// 	})
// 	.then((result) => {
// 		console.log("connected to MongoDB");
// 	})
// 	.catch((error) => {
// 		console.log("error connecting to MongoDB:", error.message);
// 	});

// const userScheme = new mongoose.Schema({
// 	username: String,
// 	password: String,
// 	points: Number,
// 	ow: Number,
// });

// userScheme.set("toJSON", {
// 	transform: (document, returnedObject) => {
// 		returnedObject.id = returnedObject._id.toString();
// 		delete returnedObject._id;
// 		delete returnedObject.__v;
// 	},
// });

// User = mongoose.model("User", userScheme);

// const likeScheme = new mongoose.Schema({
// 	receiver: String,
// 	sender: String,
// 	vote: Number,
// });

// likeScheme.set("toJSON", {
// 	transform: (document, returnedObject) => {
// 		returnedObject.id = returnedObject._id.toString();
// 		delete returnedObject._id;
// 		delete returnedObject.__v;
// 	},
// });
// Like = mongoose.model("Like", likeScheme);

// users = [];
// posts = [];
// likes = [];

// const updatePoints = (like) => {
// 	User.findOne({ username: like.receiver }, (err, result) => {
// 		if (result) {
// 			const receiver = result;
// 			User.findOne({ username: like.sender }, (err, result) => {
// 				if (result) {
// 					console.log("trovato secondo userrr");
// 					const sender = result;
// 					const other_points = sender.points;
// 					nw = receiver.ow + other_points;
// 					const points =
// 						(receiver.points * receiver.ow) / nw +
// 						(other_points * parseInt(like.vote)) / nw;

// 					const ow = nw;
// 					User.findOneAndUpdate(
// 						{ username: like.receiver },
// 						{ points: points, ow: ow },
// 						(err, result) => {
// 							if (result) {
// 								console.log("voto aggiornato");
// 							} else {
// 								console.log("errore nel salvataggio");
// 							}
// 						}
// 					);
// 				} else {
// 					console.log("sender not found");
// 				}
// 			});
// 		} else {
// 			console.log("receiver not found");
// 		}
// 	});
// };

// const generateId = (array) => {
// 	const maxId = array.length > 0 ? Math.max(...array.map((n) => n.id)) : 0;
// 	return maxId + 1;
// };

// app.get("/", (request, response) => {
// 	response.send("<h1>Hello World!</h1>");
// });

// app.get("/api/points/:username", (request, response) => {
// 	User.findOne({ username: request.params.username }, (err, result) => {
// 		if (result) {
// 			response.json({ Points: result.points });
// 		} else {
// 			response.status(404).send("User not found");
// 		}
// 	});
// });

// app.post("/api/new_user", (request, response) => {
// 	const user = request.body;
// 	if (!user.username) {
// 		return response.status(400).json({
// 			error: "content missing",
// 		});
// 	}

// 	User.findOne({ username: user.username }, (error, res) => {
// 		if (res) {
// 			console.log(res);
// 			return response.status(400).json({
// 				error: "User already exist",
// 			});
// 		} else {
// 			const user_c = new User({
// 				username: user.username,
// 				password: user.password,
// 				points: 6,
// 				ow: 1,
// 			});
// 			// users.push(user);
// 			user_c.save().then((result) => {
// 				console.log("created user");
// 				response.json(user);
// 			});
// 		}
// 	});
// });

// app.post("/api/new_post", (request, response) => {
// 	const post = request.body;
// 	post["id"] = generateId(posts);
// 	post["likes"] = [];
// 	posts.push(post);
// 	response.json(post);
// 	console.log(posts);
// });

// app.get("/api/likes/:id", (request, response) => {
// 	for (let element of posts) {
// 		if (element.id === parseInt(request.params.id)) {
// 			response.json({ Likes: element.likes });
// 			return;
// 		}
// 	}
// 	response.status(404).send("Post not found");
// });

// app.post("/api/new_like", (request, response) => {
// 	const like = request.body;
// 	updatePoints(like);
// 	response.json(like);
// });

// const PORT = 3001;
// app.listen(PORT, () => {
// 	console.log(`Server running on port ${PORT}`);
// });
