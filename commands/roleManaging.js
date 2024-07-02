const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("role")
		.setDescription("Give/remove role to every member with a different role")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("give")
				.setDescription("Give role to every member with a different role")
				.addRoleOption((option) => option.setName("role-new").setDescription("Role that you want added").setRequired(true))
				.addRoleOption((option) =>
					option.setName("members-role").setDescription("Role of which members should get the new role.").setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("remove")
				.setDescription("Remove role from every member with a different role")
				.addRoleOption((option) => option.setName("role-new").setDescription("Role that you want added").setRequired(true))
				.addRoleOption((option) =>
					option.setName("members-role").setDescription("Role of which members should get the new role.").setRequired(true)
				)
		),
	execute: async ({client, interaction}) => {
		const guild = await client.guilds.cache.get(interaction.guild.id);
		await guild.members.fetch();
		const newRole = interaction.options.getRole("role-new");
		const membersRole = interaction.options.getRole("members-role");
		const subcommand = interaction.options.getSubcommand();

		let memberCount = 0;
		let memberNotIncluded = 0;

		try {
			guild.members.cache.forEach(async (member) => {
				if (member.roles.cache.has(membersRole.id)) {
					if (subcommand === "give") {
						if (member.roles.cache.has(newRole.id)) {
							memberNotIncluded += 1;
						} else {
							memberCount += 1;
							await member.roles.add(newRole.id);
						}
					} else if (subcommand === "remove") {
						if (!member.roles.cache.has(newRole.id)) {
							memberNotIncluded += 1;
						} else {
							memberCount += 1;
							await member.roles.remove(newRole.id);
						}
					}
				}
			});

			let message = `Members (${memberCount}) with the ${membersRole} `;

			if (subcommand === "give") {
				message += `recieved the ${newRole} role.`;
				if (memberNotIncluded != 0) {
					message += `\n ${memberNotIncluded} members already had the role.`;
				}
			} else if (subcommand === "remove") {
				message += `have had their ${newRole} role removed.`;
				if (memberNotIncluded != 0) {
					message += `\n ${memberNotIncluded} members didn't have the role.`;
				}
			}

			await interaction.reply(message);
		} catch (error) {
			interaction.reply({content: `Error sending message: ${error}`, ephemeral: true});
			console.error(error);
		}
	},
};
