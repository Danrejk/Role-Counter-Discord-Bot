const {SlashCommandBuilder} = require("@discordjs/builders");
const {statusMessagesLinkedRoles} = require("../components/linked/statusMessageLinkedRoles");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("convert")
		.setDescription("Check list of linked roles.")
		.addStringOption((option) =>
			option
				.setName("type")
				.setDescription("Type of linked roles for me to display")
				.setRequired(true)
				.addChoices(
					{name: "Freemark to Netherite", value: "freemark", description: "Converts an ammount of freemarks to netherite."},
					{name: "Netherite to Freemark", value: "netherite", description: "Converts an ammount of netherite to freemarks."}
				)
		)
		.addIntegerOption((option) => option.setMinValue(0).setName("ammount").setDescription("Ammount of netherite/freemark").setRequired(true)),
	execute: async ({client, interaction}) => {
		let message = "";
		const ammount = interaction.options.getInteger("ammount");

		const type = interaction.options.getString("type");
		switch (type) {
			case "freemark":
				const remaining = ammount % 16;
				const result = (ammount - remaining) / 16;
				message += `${result} netherite ingots`;
				if (remaining != 0) message += ` and ${remaining}FM.\n(Or ${ammount / 16} netherite ingots)`;
				break;
			case "netherite":
				message += `${ammount * 16}FM.`;
				break;
		}

		await interaction.reply(message);
	},
};
