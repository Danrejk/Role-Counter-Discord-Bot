const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord-api-types/v10");
const { updateMessages } = require("../components/updateMessages");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("manual-update")
		.setDescription("Manualy updates Role Member Count messages")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
	execute: async ({ client, interaction }) => {
		// Interaction Reply
		await interaction.deferReply({ ephemeral: true });

		interactionGuildId = interaction.guild.id;
		updateMessages({ client, interactionGuildId });

		await interaction.editReply({
			content: "Updated all Role Member Counters!",
			ephemeral: true,
		});
	},
};
