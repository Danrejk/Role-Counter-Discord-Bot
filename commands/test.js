const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("map")
    .setDescription("Sprawdź mapę"),
  async execute(interaction) {
    console.log("Map command");
    await interaction.reply("Nie");
  },
};
