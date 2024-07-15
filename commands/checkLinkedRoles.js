const {SlashCommandBuilder} = require("@discordjs/builders");
const {PermissionFlagsBits} = require("discord-api-types/v10");
const {statusMessagesLinkedRoles} = require("../components/linked/statusMessageLinkedRoles");

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
		await statusMessagesLinkedRoles({client, interactionGuildId: interaction.guild.id}).then(async ({organisations, subjectMasters}) => {
			let message = "";
			const type = interaction.options.getString("type");
			switch (type) {
				case "member":
					message += organisations;
					break;
				case "subject":
					message += subjectMasters;
					break;
			}

			await interaction.reply(message);
		});
	},
};
