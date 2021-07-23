import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
const Home = () => {
	const currentUser = AuthService.getCurrentUser();
	const [content, setContent] = useState("");

	useEffect(() => {
		UserService.getFeed(currentUser).then(
			(response) => {
				setContent(response.data);
			},
			(error) => {
				const _content =
					(error.response && error.response.data) ||
					error.message ||
					error.toString();

				setContent(_content);
			}
		);
	}, [currentUser]);

	return (
		<div className="container">
			<header className="jumbotron">
				<h3>{content}</h3>
			</header>
		</div>
	);
};

export default Home;
