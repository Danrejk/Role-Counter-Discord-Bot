const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("end-interview")
		.setDescription("Send the interview to the admin discord server.")
		.addStringOption((option) => option.setName("ign").setDescription("in-game nickname").setRequired(true))
		.addUserOption((option) => option.setName("user").setDescription("(MANUAL) Applicant account")),
	execute: async ({client, interaction}) => {
		// interaction.deferReply();

		// trotu server
		const interviewerRoleId = "963833565370519632";
		const applicantRoleId = "1024958417649025116";
		const adminRoleId = "823546372049076264";
		const modRoleId = "1081995595104911451";
		const chieftainRoleId = "1054147703547891762";

		// admin server
		const adminRoleIdAdmin = "1167029926055137310";
		const modRoleIdAdmin = "1167029963791286333";
		const chieftainRoleIdAdmin = "1167030062147715153";
		const adminGuildId = "1167029522466603108";
		const interviewsChannelId = "1167030861825327144";

		if (
			!(
				interaction.member.roles.cache.has(interviewerRoleId) ||
				interaction.member.roles.cache.has(adminRoleId) ||
				interaction.member.roles.cache.has(modRoleId) ||
				interaction.member.roles.cache.has(chieftainRoleId)
			)
		) {
			return await interaction.reply({
				content: `You aren't an <@&${interviewerRoleId}>! You can't send the interview to the Admin Chat.`,
				ephemeral: true,
			});
		}

		adminGuild = client.guilds.cache.get(adminGuildId);
		if (adminGuild) {
			interviewsChannel = adminGuild.channels.cache.get(interviewsChannelId);
			if (!interviewsChannel) {
				await interaction.reply({content: "There has been an error getting the Interviews channel from the Admin discord", ephemeral: true});
			}

			const ign = interaction.options.getString("ign");
			user = interaction.options.getUser("user");
			await interaction.guild.members.fetch();

			// get the applicant
			if (user == null) {
				// if user is not set manually
				const threadMembers = await interaction.channel.members;
				applicant = threadMembers.filter((u) => u.roles.cache.has(applicantRoleId));
				if (applicant.size != 1) {
					// if no definitive applicant is found
					return await interaction.reply({
						content: "No applicant or more than one were found. Manual input is needed",
						ephemeral: true,
					});
				}
				user = [...applicant][0][1]; // convert a map into an array, get the first (only) item. Get the second item which is the actual user data. The first one is just some id.
			} else {
				user = await interaction.guild.members.cache.get(user.id);
			}
			console.log(user.user);

			const username = user.user.username;
			const userId = user.user.id;

			const threadLink = `https://discord.com/channels/${interaction.guild.id}/${interaction.channelId}`;

			// send interview to the admin chat
			const sentInterview = await interviewsChannel.send({
				content: `IGN: ${ign}\nUsername: ${username} (${user.user})\nID: ${userId}\n${threadLink}`,
			});
			const openedThread = await sentInterview.startThread({name: ign});
			await openedThread.send(`<@&${adminRoleIdAdmin}> <@&${modRoleIdAdmin}> <@&${chieftainRoleIdAdmin}>\n${threadLink}\n`);

			// reply to the interaction
			try {
				await user.setNickname(ign);
			} catch (error) {
				console.error("Failed to set nickname:", error);
				interaction.channel.send("Failed to set nickname:", error);
			}

			await interaction.reply(`The interview of the user *${user.user} (IGN: ${ign})* has been sent to the Admin Chat!`);
		}
	},
};
