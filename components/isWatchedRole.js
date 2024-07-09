const sqlite3 = require("sqlite3").verbose();

async function isWatchedRole(roleId) {
	const db = new sqlite3.Database("./data.db", sqlite3.OPEN_READ, (err) => {
		if (err) return console.errror(err.message);
	});

	db.all(`SELECT roleId FROM watchedRoles WHERE roleId = ?`, [roleId], async (err, results) => {
		if (err) {
			console.error(err);
			reject(err);
			return;
		}

		if (results.length != 0) return true;
		return false;
	});
}

module.exports = {isWatchedRole};
