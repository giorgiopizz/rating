import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3001/api/test/";

function getFeed(currentUser) {
	if (currentUser) {
		return axios.get(API_URL + "user/" + currentUser.username, {
			headers: authHeader(),
		});
	}
	return axios.get(API_URL + "all");
}

function getVote(user) {
	return axios.get(API_URL + "vote/" + user);
}

export default {
	getFeed,
	getVote,
};
