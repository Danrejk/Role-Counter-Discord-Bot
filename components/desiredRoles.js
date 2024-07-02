module.exports = (role) => {
	const roleSymbols = [`"`, `'`, `[`, `{`];

	if (roleSymbols.includes(role?.[0])) return true;
	return false;
};
