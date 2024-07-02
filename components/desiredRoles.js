module.exports = (role) => {
	const roleSymbols = [`"`, `'`, `[`, `{`];

	if (roleSymbols.includes(role)) return true;
	return false;
};
