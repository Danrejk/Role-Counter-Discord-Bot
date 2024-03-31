const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord-api-types/v10");

const sqlite3 = require('sqlite3').verbose();

module.exports = {
	data: new SlashCommandBuilder()
        .setName("change-leader")
        .setDescription("Changes the leader of a role")
        .addRoleOption(option => option.setName("role").setDescription("A role of which leader will be changed.").setRequired(true))
        .addStringOption(option => option.setName("leader").setDescription("(Optional) Leader of the state/organisation").setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
	execute: async ({ client, interaction }) => {
                if(interaction.member.roles.cache.has(roleId)){
                    roleId = interaction.options.getRole("role").id
                    guildId = interaction.options.getRole("role").guild.id
                    leader = interaction.options.getString("leader")
    
                    const db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) =>{
                            if (err) return console.errror(err.message);})
    
                    db.all(`SELECT roleId FROM watchedRoles WHERE roleId LIKE ?`, [roleId], async(err, rows) => {
                            result = rows.map(row => row.roleId)
    
                            // If the role isn't on the watch list
                            if(result.length == 0){
                                    await interaction.reply({
                                        content: `<@&${roleId}> isn't on the Role Member Counter watch list!`,
                                        ephemeral: true
                                    })
                            }
                            else{
                                    db.run(`UPDATE watchedRoles SET leader = ? WHERE roleId = ?`, [leader, roleId], async(err) => {
                                            if (err) {
                                                return console.error(err.message);
                                            }
                                            await interaction.reply(`<@&${roleId}>'s leader has been updated to ${leader}`);
                                        });
                            }
                    })
                    
                    db.close((err) => { if(err) return console.error(err.message) })
                }
                else{
                    await interaction.reply({
                        content: `You are not part of <@&${roleId}> and thus, can't modify its leader.`,
                        ephemeral: true
                    })
                }
                
        },
}
