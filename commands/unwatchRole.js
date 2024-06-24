const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord-api-types/v10");
const sqlite3 = require("sqlite3").verbose();
const { updateMessages } = require("../components/updateMessages");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("unwatch-role")
		.setDescription("Removes a role from the counter watch list")
		.addRoleOption((option) =>
			option
				.setName("role")
				.setDescription("A role to be removed from the watch list.")
				.setRequired(true)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
	execute: async ({ client, interaction }) => {
		roleId = interaction.options.getRole("role").id;
		guildId = interaction.options.getRole("role").guild.id;

		const db = new sqlite3.Database(
			"./data.db",
			sqlite3.OPEN_READWRITE,
			(err) => {
				if (err) return console.errror(err.message);
			}
		);

		db.all(
			`SELECT roleId FROM watchedRoles WHERE roleId LIKE ?`,
			[roleId],
			async (err, rows) => {
				result = rows.map((row) => row.roleId);

				// If the role isn't on the list
				if (result.length == 0) {
					await interaction.reply({
						content: `<@&${roleId}> wasn't on the list`,
						ephemeral: true,
					});
				} else {
					db.run(
						`DELETE FROM watchedRoles WHERE roleId LIKE ?`,
						[roleId],
						async (err) => {
							if (err) {
								return console.error(err.message);
							}
							await interaction.reply(
								`<@&${roleId}> was removed from the Role Member Counter watch list!`
							);

							interactionGuildId = interaction.guild.id;
							updateMessages({ client, interactionGuildId });
						}
					);
				}
			}
		);

		db.close((err) => {
			if (err) return console.error(err.message);
		});
	},
};
