const { SlashCommandBuilder } = require("@discordjs/builders");

const sqlite3 = require('sqlite3').verbose();

module.exports = {
	data: new SlashCommandBuilder()
        .setName("check-status")
        .setDescription("Displays the current count of members of each watched role."),
	execute: async ({ client, interaction }) => {
                const db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) =>{
                        if (err) return console.errror(err.message);})

                let memberCount = {}
                db.all(`SELECT * FROM watchedRoles`, async (err, results) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    
                        for (const role of results) {
                            try {
                                const guild = await client.guilds.fetch(role.guildId);
                                const guildRole = await guild.roles.cache.get(role.roleId);
                                const memberCount = guildRole ? guildRole.members.size : 0;
                                console.log(`Role ID: ${role.roleId}, Member Count: ${memberCount}`);
                            } catch (err) {
                                console.error(err);
                            }
                        }
                    });
                db.close((err) => { if(err) return console.error(err.message) })

        await interaction.reply({
          content:"lorem ipsum",
          ephemeral: true,
        })
	},
}