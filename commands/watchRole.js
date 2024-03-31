const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord-api-types/v10");

const sqlite3 = require('sqlite3').verbose();

module.exports = {
	data: new SlashCommandBuilder()
        .setName("watch-role")
        .setDescription("Adds a role to the counter watch list")
        .addRoleOption(option => option.setName("role").setDescription("A role to be added to the watch list.").setRequired(true))
        .addStringOption(option => option.setName("category").setDescription("Role Category").setRequired(true)
                .addChoices(
                { name: 'Country', value: 'country', description: 'A fully independent country looking for new players'},
                { name: 'Subject', value: 'subject', description: 'A state under an independent country' },
                { name: 'City-State', value: 'city-state', description: 'A fully independent state NOT looking for new players and/or inactive'},
                { name: 'Organisation', value: 'organisation', description: 'An organisation'},
                { name: 'Religion', value: 'religion', description: 'A faith or set of beliefs'},
                ))
        .addStringOption(option => option.setName("leader").setDescription("(Optional) Leader of the state/organisation").setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
	execute: async ({ client, interaction }) => {
                roleId = interaction.options.getRole("role").id
                guildId = interaction.options.getRole("role").guild.id
                category = interaction.options.getString("category")
                leader = interaction.options.getString("leader")

                const db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) =>{
                        if (err) return console.errror(err.message);})

                db.all(`SELECT roleId FROM watchedRoles WHERE roleId LIKE ?`, [roleId], async(err, rows) => {
                        result = rows.map(row => row.roleId)
                        console.log(result)
                        // If the role isn't already added - Add it to the Watch list
                        if(result.length == 0){
                                db.run(`INSERT INTO watchedRoles (roleId, guildId, category, leader) VALUES (?, ?, ?, ?)`, [roleId, guildId, category, leader]);
                                await interaction.reply(`Added <@&${roleId}> to the Role Member Counter watch list!`)
                        }
                        else{
                                db.run(`UPDATE watchedRoles SET guildId = ?, category = ?, leader = ? WHERE roleId = ?`, [guildId, category, leader, roleId], async(err) => {
                                        if (err) {
                                            return console.error(err.message);
                                        }
                                        await interaction.reply(`This role was already on the Role Watch List. <@&${roleId}> has been updatedchanges}`);
                                    });
                        }
                })
                
                db.close((err) => { if(err) return console.error(err.message) })
        },
}
