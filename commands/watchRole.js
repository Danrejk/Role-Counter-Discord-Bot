const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord-api-types/v10");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("watch-role")
        .setDescription("Adds a role to the counter watch list")
        .addRoleOption(option => option.setName("role").setDescription("A role to be added to the watch list.").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
	execute: async ({ client, interaction }) => {
        await interaction.reply({
          content:"lorem ipsum",
        })
	},
}
