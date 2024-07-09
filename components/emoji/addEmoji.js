const color = "\x1b[35m";
const colorReset = "\x1b[0m";

async function addEmoji({client, interactionGuildId, roleId}) {
	const guild = client.guilds.cache.get(interactionGuildId);
	const emojiGuild = client.guilds.cache.get("1259516467721011250");

	const guildName = guild.name;

	try {
		// fetch the image url
		const role = await guild.roles.fetch(roleId);
		const roleIconURL = role.iconURL();

		// update/create emojis
		if (roleIconURL) {
			await emojiGuild.emojis.fetch();
			const existingEmoji = emojiGuild.emojis.cache.find((emoji) => emoji.name === roleId);
			if (existingEmoji) {
				await existingEmoji.edit({image: roleIconURL});
				console.log(`${color}[${guildName}]${colorReset} Updated emoji: ${roleId}`);
			} else {
				await emojiGuild.emojis.create({attachment: roleIconURL, name: roleId});
				console.log(`${color}[${guildName}]${colorReset} Created emoji: ${roleId}`);
			}
		}
	} catch (error) {
		console.error("Error adding a role emoji:", error);
	}
}

module.exports = {addEmoji};
