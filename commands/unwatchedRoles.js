const {SlashCommandBuilder} = require("@discordjs/builders");
const {PermissionFlagsBits} = require("discord-api-types/v10");
const desiredRoles = require("../components/desiredRoles");
const sqlite3 = require("sqlite3").verbose();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("unwatched-roles")
		.setDescription("List roles that probably should be watched, but aren't")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	execute: async ({client, interaction}) => {
		const db = new sqlite3.Database("./data.db", sqlite3.OPEN_READWRITE, (err) => {
			if (err) {
				interaction.reply({content: `Error sending a message: ${error}`, ephemeral: true});
				console.error(err);
				reject(err);
				return;
			}

			db.all(`SELECT roleId FROM watchedRoles WHERE guildId = ?`, [interaction.guild.id], async (err, results) => {
				if (err) {
					interaction.reply({content: `Error sending a message: ${error}`, ephemeral: true});
					console.error(err);
					reject(err);
					return;
				}
				const watchedRolesList = results.map((result) => result.roleId);

				const guild = await client.guilds.cache.get(interaction.guild.id);
				const guildRoles = await guild.roles.fetch();
				let unwatchedRolesList = [];

				guildRoles.forEach((role) => {
					if (!watchedRolesList.includes(role.id)) {
						if (desiredRoles(role.name)) {
							unwatchedRolesList.push(role.id);
						}
					}
				});

				let message = "List of propositions to add to the watch list:\n";
				unwatchedRolesList.forEach((roleId) => {
					message += `- <@&${roleId}>\n`;
				});
				try {
					await interaction.reply({
						content: message,
						ephemeral: true,
					});
				} catch (error) {
					interaction.reply({content: `Error sending a message: ${error}`, ephemeral: true});
					console.error(error);
				}
			});
		});
	},
};
