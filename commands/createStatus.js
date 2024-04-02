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
                await interaction.deferReply({ ephemeral: true })
                const db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) =>{
                        if (err) return console.errror(err.message);})

                // SEND MESSAGE
                interactionGuildId = interaction.guild.id
                statusMessages({ client, interactionGuildId })
                .then(async({ countries, city_states, subjects, organisations, religions }) => {
                        // Interaction Reply
                        await interaction.editReply({
                                content: "A new Role Member Count status message has been added!"
                        });

                        // Updated Message
                        let sqlRequest = `INSERT INTO updatedMessages (guildId, channelId, threadId, countriesMessageId, city_statesMessageId, subjectsMessageId, organisationsMessageId, religionsMessageId) VALUES(
                                ${interaction.guild.id}, 
                                ${interaction.channel.type == 0 ? interaction.channel.id : interaction.channel.parentId},
                                ${interaction.channel.type == 0 ? null : interaction.channel.id}, `

                        sentMessage = await interaction.channel.send(countries)
                        sqlRequest += `${sentMessage.id}, `
                        sentMessage = await interaction.channel.send({content: city_states})
                        sqlRequest += `${sentMessage.id}, `
                        sentMessage = await interaction.channel.send(subjects)
                        sqlRequest += `${sentMessage.id}, `
                        sentMessage = await interaction.channel.send(organisations)
                        sqlRequest += `${sentMessage.id}, `
                        sentMessage = await interaction.channel.send(religions)
                        sqlRequest += `${sentMessage.id}`

                        sqlRequest += `)`

                        console.log(sqlRequest)
                        db.run(sqlRequest)


                        db.close((err) => { if(err) return console.error(err.message) })
                })
                
	},
}