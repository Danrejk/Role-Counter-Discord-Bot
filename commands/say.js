const {SlashCommandBuilder} = require("@discordjs/builders");
const {error} = require("console");
const {PermissionFlagsBits} = require("discord-api-types/v10");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("say")
		.setDescription("Say stuff")
		.addStringOption((option) => option.setName("message").setDescription("message for me to say").setRequired(true))
		.addStringOption((option) => option.setName("reply").setDescription("id of a message to reply").setRequired(false))
		.addBooleanOption((option) => option.setName("tts").setDescription("Text to speech").setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	execute: async ({client, interaction}) => {
		let message = interaction.options.getString("message");
		try {
			await interaction.channel.send({
				content: message,
				tts: interaction.options.getBoolean("tts") ?? false,
				reply: {messageReference: interaction.options.getString("reply") ?? null},
			});
		} catch (error) {
			interaction.channel.send({content: `Error sending a message: ${error}`, ephemeral: true});
			console.error(error);
		}

		sentMessage = await interaction.reply({content: "Did it", ephemeral: true});
		sentMessage.delete();
	},
};
