const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require("discord-api-types/v10");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Say stuff")
        .addStringOption(option =>
            option.setName("message").setDescription("message for me to say").setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName("tts").setDescription("Text to speech").setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	execute: async ({ client, interaction }) => {
                let message = interaction.options.getString("message")
                await interaction.channel.send({content: message, tts: interaction.options.getBoolean("tts") ?? false});

                sentMessage = await interaction.reply({content:"Did it", ephemeral: true});
                sentMessage.delete()
	},
}