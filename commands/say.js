const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require("discord-api-types/v10");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Say stuff")
        .addStringOption(option =>
            option.setName("message").setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	execute: async ({ client, interaction }) => {
                let message = interaction.options.getString("message")
                await interaction.channel.send({content: message});

                sentMessage = await interaction.reply({content:"Did it", ephemeral: true});
                sentMessage.delete()
	},
}