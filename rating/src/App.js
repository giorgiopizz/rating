import "./styles.css";

import React from "react";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Vote from "./components/Vote";
import { useGestureResponder } from "react-gesture-responder";
import axios from "axios";

const round = (x, precision) => {
	return Math.round(x * precision) / precision;
};

const getUser = (name, setVote, setUserFound) => {
	axios
		.get("http://localhost:3001/api/points/" + name)
		.then((response) => {
			console.log("promise fulfilled " + response.data);
			setVote(round(response.data.Points, 1000));
			setUserFound(true);
		})
		.catch(() => {
			setName("");
			setVote(0);
		});
};

export default function App() {
	const [name, setName] = useState("giorgio");
	const [vote, setVote] = useState(6);

	const [userFound, setUserFound] = useState(false);

	const [voteToSend, setVoteToSend] = useState(6);

	const [x, setX] = useState(0);

	const [send, setSend] = useState(false);
	const [confirm, setConfirm] = useState(false);
	const [label, setLabel] = useState("");

	const { bind } = useGestureResponder({
		// the view should claim the responder when touched
		onStartShouldSet: () => true,
		onMove: (state) => {
			const [x] = state.delta;
			setX(x);
			if (
				Math.abs(state.delta[0] / window.innerWidth) >
					Math.abs(state.delta[1] / window.innerHeight) &&
				!send
			) {
				var v = Math.round((state.delta[0] / window.innerWidth) * 12);
				if (v > 10) {
					v = 10;
				} else if (v < 0) {
					v = 0;
				}
				setVoteToSend(v);
				setLabel("Swipe up to send");
			}
		},
		onRelease: ({ delta }) => {
			// release callback
			console.log(delta);
			if (delta[1] / window.innerHeight < -0.25) {
				console.log("prova mand");
				if (!send && !confirm) {
					setSend(true);
					setLabel("Swipe up to confirm, down for new vote");
				} else if (send && !confirm) {
					setConfirm(true);
					const Like = {
						sender: myName,
						receiver: name,
						vote: voteToSend,
					};
					axios
						.post("http://localhost:3001/api/new_like", Like)
						.then(() => {
							setLabel(
								"Sent vote " +
									voteToSend +
									". Swipe down for new vote"
							);
							console.log("Mandato " + voteToSend);
							setVote(6);
							setMyVote(6);
						});
				} else {
					setLabel("");
				}
			} else if (delta[1] / window.innerHeight > 0.25) {
				setLabel("");
				setSend(false);
				setConfirm(false);
				setVoteToSend(6);
			}
			setX(0);
		},
	});

	useEffect(() => {
		console.log("aggiorno nome e voto");
		getUser(name, setName, setVote);
		if (name === "") {
			setUserFound(false);
		} else {
			setUserFound(true);
		}
	}, [name, vote]);

	if (userFound) {
		return (
			<div className="App">
				<Header chgName={setName} myName={myName} myVote={myVote} />
				<div className="Bd" {...bind}>
					<h1>{name}</h1>
					<h2>{vote}</h2>

					<Vote
						voteToSend={voteToSend}
						setVoteToSend={setVoteToSend}
						label={label}
					/>
				</div>
			</div>
		);
	} else {
		return (
			<div className="App">
				<Header chgName={setName} myName={myName} myVote={myVote} />
				<div className="Bd">
					<h1>User not found</h1>
				</div>
			</div>
		);
	}
}
