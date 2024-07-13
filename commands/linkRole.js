const {SlashCommandBuilder} = require("@discordjs/builders");
const {PermissionFlagsBits} = require("discord-api-types/v10");
const sqlite3 = require("sqlite3").verbose();
const {updateMessages} = require("../components/updateMessages");
const {updateLeaders} = require("../components/updateLeaders");
const {addEmoji} = require("../components/emoji/addEmoji");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("link-role")
		.setDescription("Adds a role to the counter watch list")
		.addRoleOption((option) => option.setName("role").setDescription("A role to be added to the linked roles list.").setRequired(true))
		.addRoleOption((option) =>
			option.setName("master-role").setDescription("A role that will be given upon recieving the linked role.").setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("type")
				.setDescription("Role connection type")
				.setRequired(true)
				.addChoices(
					{name: "Member", value: "member", description: "A member of an organisation."},
					{name: "Subject", value: "subject", description: "A state under an independent country."}
				)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
	execute: async ({client, interaction}) => {
		roleId = interaction.options.getRole("role").id;
		guildId = interaction.options.getRole("role").guild.id;
		masterId = interaction.options.getRole("master-role").id;
		type = interaction.options.getString("type");

		const db = new sqlite3.Database("./data.db", sqlite3.OPEN_READWRITE, (err) => {
			if (err) return console.errror(err.message);
		});

		db.all(`SELECT roleId, masterId FROM linkedRoles WHERE roleId LIKE ? AND masterId LIKE ?`, [roleId, masterId], async (err, rows) => {
			result = rows.map((row) => row.roleId);

			if (result.length == 0) {
				// If the role isn't already added - Add it to the Watch list
				db.run(`INSERT INTO linkedRoles (roleId, guildId, masterId, type) VALUES (?, ?, ?, ?)`, [roleId, guildId, masterId, type]);
				await interaction.reply(
					`Linked the <@&${masterId}> role to its ${type} <@&${roleId}>.\nNow every member of <@&${roleId}> will recieve it.`
				);
			} else {
				// if the role was added - just respond
				await interaction.reply({content: `<@&${masterId}> is already linked to <@&${roleId}> as a ${type}.`, ephemeral: true});
			}
		});

		db.close((err) => {
			if (err) return console.error(err.message);
		});
	},
};
