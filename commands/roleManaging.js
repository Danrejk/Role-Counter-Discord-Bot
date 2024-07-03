const {SlashCommandBuilder} = require("@discordjs/builders");
const {updateMessages} = require("../components/updateMessages");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("role")
		.setDescription("Give/remove role to every member with a different role")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("give")
				.setDescription("Give role to every member with a different role")
				.addRoleOption((option) => option.setName("edited-role").setDescription("Role that you want added").setRequired(true))
				.addRoleOption((option) =>
					option.setName("editting-role").setDescription("Role of which members should get the new role.").setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("remove")
				.setDescription("Remove role from every member with a different role")
				.addRoleOption((option) => option.setName("edited-role").setDescription("Role that you want added").setRequired(true))
				.addRoleOption((option) =>
					option.setName("editting-role").setDescription("Role of which members should get the new role.").setRequired(true)
				)
		),
	execute: async ({client, interaction}) => {
		const guild = await client.guilds.cache.get(interaction.guild.id);
		await guild.members.fetch();
		const editedRole = interaction.options.getRole("editedRole");
		const edittingRole = interaction.options.getRole("edittingRole");
		const subcommand = interaction.options.getSubcommand();

		let memberCount = 0;
		let memberNotIncluded = 0;

		try {
			guild.members.cache.forEach(async (member) => {
				if (member.roles.cache.has(edittingRole.id)) {
					if (member.roles.cache.has(editedRole.id)) {
						memberNotIncluded += 1;
					} else {
						memberCount += 1;
						if (subcommand === "give") {
							await member.roles.add(editedRole.id);
						} else if (subcommand === "remove") {
							await member.roles.remove(editedRole.id);
						}
					}
				}
			});

			let message = `Members (${memberCount}) with the ${edittingRole} `;

			if (subcommand === "give") {
				message += `recieved the ${editedRole} role.`;
				if (memberNotIncluded != 0) {
					message += `\n ${memberNotIncluded} members already had the role.`;
				}
			} else if (subcommand === "remove") {
				message += `have had their ${editedRole} role removed.`;
				if (memberNotIncluded != 0) {
					message += `\n ${memberNotIncluded} members didn't have the role.`;
				}
			}
			// update the role counter messages
			const interactionGuildId = interaction.guild.id;
			updateMessages({client, interactionGuildId});

			await interaction.reply(message);
		} catch (error) {
			interaction.reply({content: `Error managing roles: ${error}`, ephemeral: true});
			console.error(error);
		}
	},
};
