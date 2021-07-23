import React from "react";

const Vote = ({ voteToSend, setVoteToSend, label }) => {
	return (
		<div>
			<input
				type="range"
				id="volume"
				name="volume"
				min="0"
				max="10"
				value={voteToSend}
				onChange={(event) => setVoteToSend(event.target.value)}
			/>
			<p>{voteToSend}</p>
			<button>Send</button>
			<p> {label} </p>
		</div>
	);
};

export default Vote;
