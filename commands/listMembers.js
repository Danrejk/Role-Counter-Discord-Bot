const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("list-members")
		.setDescription("Check members of a role")
		.addRoleOption((option) => option.setName("role").setDescription("Role of which users you want listed.").setRequired(true)),
	execute: async ({client, interaction}) => {
		const guild = await client.guilds.cache.get(interaction.guild.id);
		await guild.members.fetch();
		const role = interaction.options.getRole("role");
		let memberList = [];

		try {
			// get members with the role
			guild.members.cache.forEach((member) => {
				if (member.roles.cache.has(role.id)) {
					memberList.push(member);
				}
			});

			// construct message
			message = `Members with the ${role} role (${memberList.length}):\n`;
			memberList.forEach((member) => {
				message += `- ${member}\n`;
			});
			await interaction.reply(message);
		} catch (error) {
			interaction.reply({content: `Error sending message: ${error}`, ephemeral: true});
			console.error(error);
		}
	},
};
