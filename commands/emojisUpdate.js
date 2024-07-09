const {SlashCommandBuilder} = require("@discordjs/builders");
const {PermissionFlagsBits} = require("discord-api-types/v10");
const {updateAllEmojis} = require("../components/emoji/updateAllEmojis");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("emojis-update")
		.setDescription("Manually update all watched role emojis")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	execute: async ({client, interaction}) => {
		const unixStart = Date.now();
		await interaction.deferReply({ephemeral: true});

		updateAllEmojis({client, interactionGuildId: interaction.guild.id});

		// send reply
		const unixEnd = Date.now();
		await interaction.editReply({content: `Did it in ${(unixEnd - unixStart) / 1000}s`, ephemeral: true});
	},
};
