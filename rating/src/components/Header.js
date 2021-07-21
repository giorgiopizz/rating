import { useState } from "react";

const getUser = (name, setVote) => {
	axios
		.get("http://localhost:3001/api/points/" + name)
		.then((response) => {
			console.log("promise fulfilled " + response.data);
			setVote(round(response.data.Points, 1000));
		})
		.catch(() => {
			setName("");
			setVote(0);
		});
};

import React from "react";
const Header = (props) => {
	const [myName, setMyName] = useState("giorgio");
	const [myVote, setMyVote] = useState(6);

	useEffect(() => {
		console.log("carico mio nome e mio voto");
		getUser(myName, setMyName, setMyVote);
	}, [myName, myVote]);

	const [searchName, setSearchName] = useState("");
	return (
		<div className="Header">
			<ul>
				<li>
					<a>Home</a>
				</li>
				<li className="search">
					<a>
						<input
							type="text"
							onChange={(evt) => {
								setSearchName(evt.target.value);
							}}
						/>
						<input
							type="submit"
							onClick={() => {
								console.log(searchName);
								props.chgName(searchName);
								setSearchName("");
							}}
						/>
					</a>
				</li>
				<li className="nome">
					<a>
						{myName}({myVote})
					</a>
				</li>
			</ul>
		</div>
	);
};
export default Header;
