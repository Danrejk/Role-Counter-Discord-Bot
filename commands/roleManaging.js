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
		const editedRole = interaction.options.getRole("edited-role");
		const edittingRole = interaction.options.getRole("editting-role");
		const subcommand = interaction.options.getSubcommand();

		let membersIncluded = [];
		let membersNotIncluded = [];

		try {
			guild.members.cache.forEach(async (member) => {
				if (member.roles.cache.has(edittingRole.id)) {
					if (subcommand === "give") {
						if (member.roles.cache.has(editedRole.id)) {
							membersNotIncluded.push(member);
						} else {
							membersIncluded.push(member);
							await member.roles.add(editedRole.id);
						}
					} else if (subcommand === "remove") {
						if (!member.roles.cache.has(editedRole.id)) {
							membersNotIncluded.push(member);
						} else {
							membersIncluded.push(member);
							await member.roles.remove(editedRole.id);
						}
					}
				}
			});

			let messageAltered = `Member(s) (${membersIncluded.length}) with the ${edittingRole} `;
			let messageNotAltered = "";

			if (subcommand === "give") {
				messageAltered += `recieved the ${editedRole} role:\n`;
				if (membersNotIncluded.length != 0) {
					messageNotAltered += `${membersNotIncluded.length} member(s) already had the role:\n`;
				}
			} else if (subcommand === "remove") {
				messageAltered += `have had their ${editedRole} role removed:\n`;
				if (membersNotIncluded.length != 0) {
					messageNotAltered += `${membersNotIncluded.length} member(s) didn't have the role:\n`;
				}
			}
			// Add a list of members who were effected / uneffected
			membersIncluded.forEach((member) => {
				messageAltered += `- ${member}\n`;
			});
			membersNotIncluded.forEach((member) => (messageNotAltered += `- ${member}\n`));

			// update the role counter messages
			const interactionGuildId = interaction.guild.id;
			updateMessages({client, interactionGuildId});

			await interaction.reply(`${messageAltered}\n${messageNotAltered}`);
		} catch (error) {
			interaction.reply({content: `Error managing roles: ${error}`, ephemeral: true});
			console.error(error);
		}
	},
};
