const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord-api-types/v10");

const sqlite3 = require('sqlite3').verbose();

module.exports = {
	data: new SlashCommandBuilder()
        .setName("watch-role")
        .setDescription("Adds a role to the counter watch list")
        .addRoleOption(option => option.setName("role").setDescription("A role to be added to the watch list.").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
	execute: async ({ client, interaction }) => {
                roleId = interaction.options.getRole("role").id
                guildId = interaction.options.getRole("role").guild.id

                const db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) =>{
                        if (err) return console.errror(err.message);
                        console.log('database connection successful')
                        })

                console.log(db.run(`SELECT roleId WHERE roleId LIKE ${roleId}`))
                // db.run(`INSERT INTO watchedRoles 
                // (roleId, guildId)
                // VALUES (${roleId}, ${guildId})`);
                
                console.log(db.run("SELECT * FROM watchedRoles"))

                db.close((err) => {
                        if(err) return console.error(err.message)
                })
        },
}
