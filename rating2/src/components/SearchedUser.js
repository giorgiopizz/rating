import React from "react";
import { useState, useEffect } from "react";
import Vote from "./Vote";
import { useGestureResponder } from "react-gesture-responder";
import axios from "axios";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import Utils from "../services/utils";

export default function SearchedUser(props) {
	const currentUser = AuthService.getCurrentUser();
	const searchedUser = props.searchedUser;

	const [vote, setVote] = useState(0);

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
						sender: currentUser.username,
						receiver: searchedUser,
						vote: voteToSend,
					};
					console.log(Like);
					axios
						.post("http://localhost:3001/api/test/newlike", Like)
						.then(() => {
							setLabel(
								"Sent vote " +
									voteToSend +
									". Swipe down for new vote"
							);
							setVote(6);
						})
						.catch((err) => {
							setLabel("Error");
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
		UserService.getVote(searchedUser)
			.then((response) => {
				console.log("promise fulfilled " + response.data);
				if (response.data !== "not found") {
					setVote(Utils.round(response.data.vote, 1000));
					setUserFound(true);
					setVoteToSend(6);
					setSend(false);
					setConfirm(false);
					setLabel("");
				} else {
					setUserFound(false);
				}
			})
			.catch((err) => {
				setUserFound(false);
			});
	}, [searchedUser, vote]);

	if (userFound) {
		return (
			<div>
				<div className="Bd" {...bind}>
					<h1>{searchedUser}</h1>
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
			<div>
				<div className="Bd">
					<h1>User not found</h1>
				</div>
			</div>
		);
	}
}
