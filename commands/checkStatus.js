const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("check-status")
        .setDescription("Displays the current count of members of each watched role."),
	execute: async ({ client, interaction }) => {
        await interaction.reply({
          content:"lorem ipsum",
          ephemeral: true,
        })
	},
}