const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord-api-types/v10");
const sqlite3 = require('sqlite3').verbose();
const { statusMessages } = require("../components/statusMessage");

module.exports = {
	data: new SlashCommandBuilder()
                .setName("create-status")
                .setDescription("Creates a message showing the current count of players with watched roles.")
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
	execute: async ({ client, interaction }) => {
                const db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) =>{
                        if (err) return console.errror(err.message);})

                // SEND MESSAGE
                interactionGuildId = interaction.guild.id
                statusMessages({ client, interactionGuildId })
                .then(async({ countries, city_states, subjects, organisations, religions }) => {
                        // Interaction Reply
                        await interaction.reply({
                                content: "A new Role Member Count status message has been added!",
                                ephemeral: true,
                        });

                        // Updated Message
                        sentMessage = await interaction.channel.send(countries + city_states + subjects + organisations + religions)
                        db.run(`INSERT INTO updatedMessages (guildId, channelId, messageId) VALUES (?, ?, ?)`, [interaction.guild.id, interaction.channel.id, sentMessage.id])
                        console.log(interaction.channel.id, sentMessage.id)

                        db.close((err) => { if(err) return console.error(err.message) })
                })
                
	},
}