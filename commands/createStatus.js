const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord-api-types/v10");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("create-status")
        .setDescription("Creates a message showing the current count of players with watched roles.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
	execute: async ({ client, interaction }) => {
        await interaction.reply({
          content:"lorem ipsum",
        })
	},
}