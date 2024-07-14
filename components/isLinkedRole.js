const sqlite3 = require("sqlite3").verbose();

async function isWatchedRole(roleId) {
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database("./data.db", sqlite3.OPEN_READ, (err) => {
			if (err) return console.errror(err.message);
		});

		db.all(`SELECT roleId FROM linkedRoles WHERE roleId = ?`, [roleId], (err, results) => {
			if (err) {
				console.error(err);
				reject(err);
				return;
			}

			if (results.length != 0) resolve(true);
			else resolve(false);
		});
	});
}

module.exports = {isWatchedRole};
