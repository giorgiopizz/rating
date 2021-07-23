import { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { Link, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

const Header = (props) => {
	const history = useHistory();
	const currentUser = AuthService.getCurrentUser();
	const [searchName, setSearchName] = useState("");
	const [myVote, setMyVote] = useState(0);

	useEffect(() => {
		UserService.getVote(currentUser.username).then(
			(response) => {
				setMyVote(response.data.vote);
			},
			(error) => {
				const _content =
					(error.response && error.response.data) ||
					error.message ||
					error.toString();
				console.log(error);
			}
		);
	}, []);

	const logOut = () => {
		AuthService.logout();
	};
	return (
		// <div className="Header">
		<nav className="navbar navbar-expand navbar-dark bg-dark">
			<div className="navbar-nav mr-auto">
				<li className="nav-item">
					<Link to={"/home"} className="nav-link">
						Home
					</Link>
				</li>

				<li className="search">
					<a>
						<input
							type="text"
							value={searchName}
							onChange={(evt) => {
								setSearchName(evt.target.value);
							}}
						/>
						<input
							type="submit"
							onClick={() => {
								props.changeUser(searchName);
								setSearchName("");
								history.push("/searcheduser");
							}}
						/>
					</a>
				</li>
			</div>

			{currentUser ? (
				<div className="navbar-nav ml-auto">
					<li className="nav-item">
						<a className="nav-link">
							{currentUser.username}({myVote})
						</a>
					</li>
					<li className="nav-item">
						<a href="/login" className="nav-link" onClick={logOut}>
							LogOut
						</a>
					</li>
				</div>
			) : (
				<div className="navbar-nav ml-auto">
					<li className="nav-item">
						<Link to={"/login"} className="nav-link">
							Login
						</Link>
					</li>

					<li className="nav-item">
						<Link to={"/register"} className="nav-link">
							Sign Up
						</Link>
					</li>
				</div>
			)}
		</nav>
		// </div>
	);
};
export default Header;
