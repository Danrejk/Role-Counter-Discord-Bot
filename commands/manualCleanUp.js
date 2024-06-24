const {SlashCommandBuilder} = require("@discordjs/builders");
const {PermissionFlagsBits} = require("discord-api-types/v10");
const sqlite3 = require("sqlite3").verbose();
const {updateMessages} = require("../components/updateMessages");
const {unwatchDeletedRoles} = require("../components/unwatchDeletedRoles");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("manual-cleanup")
		.setDescription("Manualy cleans up deleted roles from the Role Member Count messages")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
	execute: async ({client, interaction}) => {
		// Interaction Reply defer
		await interaction.deferReply({ephemeral: true});

		const db = new sqlite3.Database("./data.db", sqlite3.OPEN_READWRITE, (err) => {
			if (err) return console.errror(err.message);
		});

		interactionGuildId = interaction.guild.id;
		db.all(`SELECT roleId FROM watchedRoles WHERE guildId = ?`, [interactionGuildId], async (err, results) => {
			if (err) {
				console.error(err);
				reject(err);
				return;
			}

			for (const roleData of results) {
				const roleId = roleData.roleId;
				if (roleId == undefined) {
					break;
				}
				const roleExists = interaction.guild.roles.cache.has(roleId);

				if (!roleExists) {
					unwatchDeletedRoles({client, interactionGuildId, deletedRoleId: roleId});
				}
			}
		});

		// true Interaction Reply
		await interaction.editReply({
			content: "Removed all removed roles from the Role Member Counters!",
			ephemeral: true,
		});

		db.close((err) => {
			if (err) return console.error(err.message);
		});
	},
};
