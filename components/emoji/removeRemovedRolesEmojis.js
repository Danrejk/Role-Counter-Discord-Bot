const sqlite3 = require("sqlite3").verbose();

async function removeRemovedRolesEmojis({client, interactionGuildId, removedRole = undefined}) {
	// const guild = client.guilds.cache.get(interactionGuildId);
	const emojiGuild = client.guilds.cache.get("1259516467721011250");

	if (removedRole) {
		// if the emoji to be removed is specified
		const emoji = emojiGuild.emojis.cache.find((emoji) => emoji.name === removedRole);
		if (!emoji) return console.error(`${removedRole} emoji not found`);
		await emoji.delete();
		console.log(`Removed the ${emoji.name} emoji.`);
	} else {
		// if the emoji to be removed is NOT specified
		const db = new sqlite3.Database("./data.db", sqlite3.OPEN_READWRITE, (err) => {
			if (err) return console.errror(err.message);
		});

		db.all(`SELECT roleId FROM watchedRoles WHERE guildId = ?`, [interactionGuildId], async (err, results) => {
			if (err) {
				console.error(err);
				reject(err);
				return;
			}

			emojiGuild.emojis.cache.forEach(async (emoji) => {
				const emojiExists = results.find((role) => role.roleId === emoji.name);
				if (!emojiExists) {
					await emoji.delete();
					console.log(`Removed the ${emoji.name} emoji.`);
				}
			});
		});
	}
}

module.exports = {removeRemovedRolesEmojis};
