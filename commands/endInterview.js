const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord-api-types/v10");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("end-interview")
        .setDescription("Send the interview to the admin discord server.")
        .addStringOption(option =>
            option.setName("ign").setDescription("in-game nickname").setRequired(true)
        )
        .addUserOption(option => 
            option.setName("user").setDescription("(MANUAL) Applicant account")
        ),
	execute: async ({ client, interaction }) => {
        // const interviewerRoleId = "963833565370519632";
        const interviewerRoleId = "1254452208431271936";
        if(!interaction.member.roles.cache.has(interviewerRoleId)){
            return await interaction.reply({
                content: `You aren't an <@&${interviewerRoleId}>! You can't send the interview to the Admin Chat.`,
                ephemeral: true,
            })
        }

        const adminGuildId = "1167029522466603108"
        const interviewsChannelId = "1167030984949112903"
        adminGuild = client.guilds.cache.get(adminGuildId);
        if(adminGuild){
            interviewsChannel = adminGuild.channels.cache.get(interviewsChannelId);
            if(!interviewsChannel){
                await interaction.reply({content:"There has been an error getting the Interviews channel from the Admin discord", ephemeral: true})
            }

            const ign = interaction.options.getString("ign");
            user = interaction.options.getUser("user");

            // get the applicant
            if (user == null){ // if user is not set manually
                const applicantRoleId = "929709725900242975";
                await interaction.guild.members.fetch();
                const threadMembers = await interaction.channel.members;
                applicant = threadMembers.filter(u => u.roles.cache.has(applicantRoleId))
                if (applicant.size != 1){ // if no definitive applicant is found
                    return await interaction.reply({
                        content: "No applicant or more than one were found. Manual input is needed",
                        ephemeral: true
                    })
                }
                user = [...applicant][0][1].user // convert a map into an array, get the first (only) item. Get the second item which is the actual user data. The first one is just some id.
            }
            console.log(user)

            const username = user.username;
            const userId = user.id;

            // send interview to the admin chat
            try{
                await interviewsChannel.send({
                    content: `IGN: ${ign}\nUsername: ${username} (${user})\nID: ${userId}\n`,
                });
            }catch (error){
                interaction.channel.send({content: `Error sending a message: ${error}`, ephemeral: true})
                console.error(error)
            }
    
            // reply to the interaction
            sentMessage = await interaction.reply(`The interview of the user *${user} (IGN: ${ign})* has been sent to the Admin Chat!`);
        }

        
	},
}