const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord-api-types/v10");

const sqlite3 = require('sqlite3').verbose();

module.exports = {
	data: new SlashCommandBuilder()
        .setName("create-status")
        .setDescription("Creates a message showing the current count of players with watched roles.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
	execute: async ({ client, interaction }) => {
                const db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) =>{
                        if (err) return console.errror(err.message);})

                db.close((err) => { if(err) return console.error(err.message) })
	},
}