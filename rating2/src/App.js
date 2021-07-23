import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

import AuthService from "./services/auth.service";

import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import SearchedUser from "./components/SearchedUser";

const App = () => {
	const [currentUser, setCurrentUser] = useState(undefined);
	const [searchedUser, setSearchedUser] = useState("");
	useEffect(() => {
		const user = AuthService.getCurrentUser();

		if (user) {
			setCurrentUser(user);
		}
	}, []);

	return (
		<div>
			<Header changeUser={setSearchedUser} />

			<div className="container mt-3">
				<Switch>
					<Route exact path={["/", "/home"]} component={Home} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/register" component={Register} />
					<SearchedUser searchedUser={searchedUser} />
					<Redirect to="/" />
				</Switch>
			</div>
		</div>
	);
};

export default App;
