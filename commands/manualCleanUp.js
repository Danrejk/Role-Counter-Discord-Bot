const {SlashCommandBuilder} = require("@discordjs/builders");
const {PermissionFlagsBits} = require("discord-api-types/v10");
const sqlite3 = require("sqlite3").verbose();
const {updateMessages} = require("../components/updateMessages");
const {unwatchDeletedRoles} = require("../components/unwatchDeletedRoles");
const {updateLeaders} = require("../components/updateLeaders");
const {removeRemovedRolesEmojis} = require("../components/emoji/removeRemovedRolesEmojis");
const {updateUserLinkedroles} = require("../components/linked/updateUserLinkedRoles");

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
					unwatchDeletedRoles({client, interactionGuildId, deletedRoleId: roleId}); // to do: make it so you don't have to put in the deleted role id
				}
			}
		});

		const guild = client.guilds.cache.get(interactionGuildId);
		guild.members
			.fetch()
			.then(async (members) => {
				for (const member of members.values()) {
					try {
						await updateUserLinkedroles({client, interactionGuildId, user: member});
					} catch (error) {
						console.error(`Error updating linked roles for ${member.user.tag}:`, error);
					}
				}
			})
			.catch((error) => {
				console.error("Error fetching members:", error);
			});

		removeRemovedRolesEmojis({client, interactionGuildId});
		updateMessages({client, interactionGuildId});
		updateLeaders({client, interactionGuildId});

		// true Interaction Reply
		await interaction.editReply({
			content: "Cleaned everything up!",
			ephemeral: true,
		});

		db.close((err) => {
			if (err) return console.error(err.message);
		});
	},
};
