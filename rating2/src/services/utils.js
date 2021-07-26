const round = (x, precision) => {
	return Math.round(x * precision) / precision;
};

export default {
	round,
};
