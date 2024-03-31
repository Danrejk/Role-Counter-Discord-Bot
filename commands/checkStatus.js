const { SlashCommandBuilder } = require("@discordjs/builders");

const sqlite3 = require('sqlite3').verbose();

module.exports = {
	data: new SlashCommandBuilder()
        .setName("check-status")
        .setDescription("Displays the current count of members of each watched role."),
	execute: async ({ client, interaction }) => {
                const db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) =>{
                        if (err) return console.errror(err.message);})
                
                db.all(`SELECT * FROM watchedRoles`, async (err, results) => {
                        if (err) {
                            console.error(err);
                            return;
                        }

                        message = " "
                        let rolesData = {}
                    
                        for (const role of results) {
                            try {
                                const guild = await client.guilds.fetch(role.guildId);

                                // Member Count
                                await guild.members.fetch()
                                const guildRole = await guild.roles.fetch(role.roleId);
                                const memberCount = guildRole ? guildRole.members.size : 0;
                                console.log(`Role ID: ${role.roleId}, Member Count: ${memberCount}`);

                                // Add role data to rolesData
                                rolesData[role.roleId] = {
                                        "memberCount" : memberCount,
                                        "category" : role.category, 
                                        "leader" : role.leader,
                                };

                            } catch (err) {
                                console.error(err);
                            }
                        }
                        
                        // Sort by member count
                        let roleIdsSorted = Object.keys(rolesData);
                        roleIdsSorted.sort((roleIdA, roleIdB) => rolesData[roleIdB].memberCount - rolesData[roleIdA].memberCount)

                        // Sort into categories
                        countryList = []
                        city_stateList = []
                        subjectList = []
                        organisationList = []
                        religionList = []

                        roleIdsSorted.forEach(e => {
                                console.log(rolesData[e])
                                switch(rolesData[e].category){
                                        case "country": countryList.push(e); break;
                                        case "city-state": city_stateList.push(e); break;
                                        case "subject": subjectList.push(e); break;
                                        case "organisation": organisationList.push(e); break;
                                        case "religion": religionList.push(e); break;
                                }
                        })

                        // Generate message
                        countryList.forEach(e => {
                                message += `- <@&${e}> - ${rolesData[e].leader} (${rolesData[e].memberCount})\n`
                        })
                        console.log(`MESSAGE!!!!!! : ${message}`)

                        // Send message
                        await interaction.reply({
                                content: message,
                                ephemeral: true,
                              })

                    });
                db.close((err) => { if(err) return console.error(err.message) })

        
	},
}