const {SlashCommandBuilder} = require("@discordjs/builders");
const {PermissionFlagsBits} = require("discord-api-types/v10");
const {statusMessagesLinkedRoles} = require("../components/statusMessageLinkedRoles");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("check-linked-roles")
		.setDescription("Check list of linked roles.")
		.addStringOption((option) =>
			option
				.setName("type")
				.setDescription("Type of linked roles for me to display")
				.setRequired(true)
				.addChoices(
					{name: "Member", value: "member", description: "Members of organisations."},
					{name: "Subject", value: "subject", description: "States under independent countries."}
				)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	execute: async ({client, interaction}) => {
		// sentMessage = await interaction.reply({content: "Did it", ephemeral: true});
		statusMessagesLinkedRoles({client, interactionGuildId: interaction.guild.id}).then(async ({organisations, subjectMasters}) => {
			await interaction.reply(organisations + subjectMasters);
		});
	},
};
