const {SlashCommandBuilder} = require("@discordjs/builders");
const {PermissionFlagsBits} = require("discord-api-types/v10");
const sqlite3 = require("sqlite3").verbose();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("unlink")
		.setDescription("Removes a role to the counter linked roles list")
		.addRoleOption((option) => option.setName("role").setDescription("A role to be removed to the linked roles list.").setRequired(true))
		.addRoleOption((option) =>
			option.setName("master-role").setDescription("A role that is given upon recieving the linked role.").setRequired(true)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
	execute: async ({client, interaction}) => {
		roleId = interaction.options.getRole("role").id;
		masterId = interaction.options.getRole("master-role").id;

		const db = new sqlite3.Database("./data.db", sqlite3.OPEN_READWRITE, (err) => {
			if (err) return console.errror(err.message);
		});

		db.all(`SELECT roleId, masterId FROM linkedRoles WHERE roleId LIKE ? AND masterId LIKE ?`, [roleId, masterId], async (err, rows) => {
			result = rows.map((row) => row.roleId);

			if (result.length != 0) {
				// If the role is on the list - Remove from it to the Watch list
				db.run(`DELETE FROM linkedRoles WHERE roleId LIKE ? AND masterId LIKE ?`, [roleId, masterId]);
				await interaction.reply(`Unlinked the <@&${masterId}> role from <@&${roleId}>.`);
			} else {
				// if the role wasn't on the list - just respond
				await interaction.reply({content: `<@&${masterId}> isn't linked to <@&${roleId}>.`, ephemeral: true});
			}
		});

		db.close((err) => {
			if (err) return console.error(err.message);
		});
	},
};
