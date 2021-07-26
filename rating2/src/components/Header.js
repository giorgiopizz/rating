import { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { Link, useHistory } from "react-router-dom";
// import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Utils from "../services/utils";
const Header = (props) => {
	const history = useHistory();
	const currentUser = AuthService.getCurrentUser();
	const [searchName, setSearchName] = useState("");
	const [myVote, setMyVote] = useState(0);

	useEffect(() => {
		if (currentUser) {
			UserService.getVote(currentUser.username).then(
				(response) => {
					setMyVote(Utils.round(response.data.vote, 100));
				},
				(error) => {
					const _content =
						(error.response && error.response.data) ||
						error.message ||
						error.toString();
					console.log(error);
				}
			);
		}
	}, []);

	const logOut = () => {
		AuthService.logout();
	};
	return (
		// <div className="Header">
		<nav className="navbar navbar-expand navbar-dark bg-dark">
			<Link to={"/home"} className="navbar-brand">
				Home
			</Link>
			<button
				class="navbar-toggler"
				type="button"
				data-toggle="collapse"
				data-target="#navbarSupportedContent"
				aria-controls="navbarSupportedContent"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				{/* <div className="navbar-nav mr-auto"> */}
				<form className="form-inline">
					<div className="input-group">
						<div className="input-group-prepend">
							<span
								className="input-group-text"
								id="basic-addon1"
							>
								@
							</span>
						</div>
						<input
							type="text"
							className="form-control"
							placeholder="Username"
							aria-label="Username"
							aria-describedby="basic-addon1"
							value={searchName}
							onChange={(evt) => {
								setSearchName(evt.target.value);
							}}
						/>
						<button
							className="btn btn-outline-success my-2 my-sm-0"
							type="submit"
							onClick={() => {
								props.changeUser(searchName);
								setSearchName("");
								history.push("/searcheduser");
							}}
						>
							Search
						</button>
					</div>
				</form>
				<ul class="navbar-nav mr-auto">
					<li class="nav-item active">
						<a class="nav-link" href="#">
							Home <span class="sr-only">(current)</span>
						</a>
					</li>
				</ul>
				{/* <li className="search">
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
			</div> */}

				{/* {currentUser ? (
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
			)} */}
			</div>
		</nav>
	);
};
export default Header;
