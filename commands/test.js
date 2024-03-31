const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("map")
        .setDescription("Sprawdź mapę"),
	execute: async ({ client, interaction }) => {
        await interaction.reply("Nie")
	},
}