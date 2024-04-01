const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord-api-types/v10");
const sqlite3 = require('sqlite3').verbose();
const { statusMessages } = require("../statusMessage");

module.exports = {
	data: new SlashCommandBuilder()
                .setName("manual-update")
                .setDescription("Creates a message showing the current count of players with watched roles.")
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
	execute: async ({ client, interaction }) => {
                const db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) =>{
                        if (err) return console.errror(err.message);})

                // Interaction Reply
                await interaction.reply({
                        content: "Updated all Role Member Counters!",
                        ephemeral: true,
                });


                db.all(`SELECT * FROM updatedMessages`, async (err, results) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                        return;
                    }

                    statusMessages({ client, interaction })
                    .then(async({ countries, city_states, subjects, organisations, religions }) => {
                        results.forEach(async(message) =>{
                            try{
                                const guild = await client.guilds.fetch(message.guildId)
                                const channel = await guild.channels.fetch(message.channelId);
                                const fetchedMessage = await channel.messages.fetch(message.messageId);

                                fetchedMessage.edit(countries + city_states + subjects + organisations + religions)
                            } catch (error) {
                            console.error(`Error editing message: ${error}`);
                            }
                        })
                    })

                    db.close((err) => { if(err) return console.error(err.message) })
                })
	},
}