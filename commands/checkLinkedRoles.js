const {SlashCommandBuilder} = require("@discordjs/builders");
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
		),
	execute: async ({client, interaction}) => {
		await statusMessagesLinkedRoles({client, interactionGuildId: interaction.guild.id}).then(async ({organisations, subjectMasters}) => {
			let message = "";
			let messageOverflow = "";

			const type = interaction.options.getString("type");
			switch (type) {
				case "member":
					if (Array.isArray(organisations)) {
						message = organisations[0];
						messageOverflow = organisations[1];
					} else {
						message = organisations;
					}
					break;
				case "subject":
					if (Array.isArray(subjectMasters)) {
						message = subjectMasters[0];
						messageOverflow = subjectMasters[1];
					} else {
						message = subjectMasters;
						break;
					}
			}

			await interaction.reply(message);
			if (messageOverflow != "") {
				interaction.channel.send(messageOverflow);
			}
		});
	},
};
