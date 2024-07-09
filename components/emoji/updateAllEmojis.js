const sqlite3 = require("sqlite3").verbose();

const color = "\x1b[35m";
const colorReset = "\x1b[0m";

async function updateAllEmojis({client, interactionGuildId, compileUpdates = false}) {
	const unixStart = Date.now();
	const guildName = client.guilds.cache.get(interactionGuildId).name;

	const db = new sqlite3.Database("./data.db", sqlite3.OPEN_READWRITE, (err) => {
		if (err) return console.errror(err.message);
	});

	db.all(`SELECT roleId FROM watchedRoles WHERE guildId = ?`, [interactionGuildId], async (err, results) => {
		if (err) {
			console.error(err);
			reject(err);
			return;
		}

		const guild = client.guilds.cache.get(interactionGuildId);
		const emojiGuild = client.guilds.cache.get("1259516467721011250");
		let updatedEmojisCount = 0;
		let createdEmojisCount = 0;
		for (let roleId of results) {
			roleId = roleId.roleId; // at first it's an array with one property
			try {
				// fetch the image url
				const role = await guild.roles.fetch(roleId);
				const roleIconURL = role.iconURL();

				// update/create emojis
				if (roleIconURL) {
					const existingEmoji = emojiGuild.emojis.cache.find((emoji) => emoji.name === roleId);
					if (existingEmoji) {
						await existingEmoji.edit({image: roleIconURL});

						if (compileUpdates) updatedEmojisCount += 1;
						else console.log(`${color}[${guildName}]${colorReset} Updated emoji: ${roleId}`);
					} else {
						await emojiGuild.emojis.create({attachment: roleIconURL, name: roleId});

						if (compileUpdates) createdEmojisCount += 1;
						else console.log(`${color}[${guildName}]${colorReset} Created emoji: ${roleId}`);
					}
				}
			} catch (error) {
				console.error("Error updating role emojis:", error);
			}
		}
		// send reply
		const unixEnd = Date.now();
		let message = `${color}[${guildName}]${colorReset} Finished updating all emojis in ${(unixEnd - unixStart) / 1000}s`;
		if (compileUpdates && (createdEmojisCount != 0 || updatedEmojisCount != 0)) {
			message += ` in total, created ${createdEmojisCount} and updated ${updatedEmojisCount} emojis.`;
		}
		console.log(message);
	});
}

module.exports = {updateAllEmojis};
