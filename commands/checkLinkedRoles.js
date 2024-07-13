const {SlashCommandBuilder} = require("@discordjs/builders");
const {PermissionFlagsBits} = require("discord-api-types/v10");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("check-linked-roles")
		.setDescription("Say stuff")
		.addStringOption((option) => option.setName("message").setDescription("message for me to say").setRequired(true))
		.addStringOption((option) => option.setName("reply").setDescription("id of a message to reply").setRequired(false))
		.addBooleanOption((option) => option.setName("tts").setDescription("Text to speech").setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	execute: async ({client, interaction}) => {
		sentMessage = await interaction.reply({content: "Did it", ephemeral: true});
	},
};
