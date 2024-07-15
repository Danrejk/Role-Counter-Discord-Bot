const sqlite3 = require("sqlite3").verbose();

async function isMasterLinkedRole(masterId) {
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database("./data.db", sqlite3.OPEN_READ, (err) => {
			if (err) return console.errror(err.message);
		});

		db.all(`SELECT DISTINCT masterId FROM linkedRoles WHERE masterId = ?`, [masterId], (err, results) => {
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

module.exports = {isMasterLinkedRole};
