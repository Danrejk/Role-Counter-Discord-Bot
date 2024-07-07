const {SlashCommandBuilder} = require("@discordjs/builders");
const {PermissionFlagsBits} = require("discord-api-types/v10");
const sqlite3 = require("sqlite3").verbose();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("emojis-update")
		.setDescription("Manually update all watched role emojis")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	execute: async ({client, interaction}) => {
		const unixStart = Date.now();
		await interaction.deferReply({ephemeral: true});

		const db = new sqlite3.Database("./data.db", sqlite3.OPEN_READWRITE, (err) => {
			if (err) return console.errror(err.message);
		});

		const interactionGuildId = interaction.guild.id;
		db.all(`SELECT roleId FROM watchedRoles WHERE guildId = ?`, [interactionGuildId], async (err, results) => {
			if (err) {
				console.error(err);
				reject(err);
				return;
			}

			const guild = client.guilds.cache.get(interactionGuildId);
			const emojiGuild = client.guilds.cache.get("1259516467721011250");
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
							console.log(`Updated emoji: ${roleId}`);
						} else {
							await emojiGuild.emojis.create({attachment: roleIconURL, name: roleId});
							console.log(`Created emoji: ${roleId}`);
						}
					}
				} catch (error) {
					console.error("Error updating role emojis:", error);
				}
			}
			// send reply
			const unixEnd = Date.now();
			await interaction.editReply({content: `Did it in ${(unixEnd - unixStart) / 1000}s`, ephemeral: true});
		});
	},
};
