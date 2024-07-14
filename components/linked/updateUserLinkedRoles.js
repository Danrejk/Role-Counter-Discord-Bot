const sqlite3 = require("sqlite3").verbose();

async function updateUserLinkedroles({client, interactionGuildId, userId}) {
	const db = new sqlite3.Database("./data.db", sqlite3.OPEN_READ, (err) => {
		if (err) return console.errror(err.message);
	});

	db.all(`SELECT roleId, masterId, type FROM linkedRoles WHERE guildId = ?`, [guildId], (err, results) => {
		if (err) {
			console.error(err);
			reject(err);
			return;
		}

		const guild = client.guilds.cache.get(guildId);
		const user = guild.members.cache.get(userId);
		user.roles.fetch();
	});
}

module.exports = {updateUserLinkedroles};
