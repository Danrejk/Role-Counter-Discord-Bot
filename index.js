const express = require("express");
const app = express();
const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');

// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) =>{
//   if (err) return console.errror(err.message);
//   console.log('database connection successful')
// })

// db.run(`CREATE TABLE watchedRoles(roleId, guildId)`);

// db.close((err) => {
//   if(err) return console.error(err.message)
// })

const fs = require("fs");
const path = require("path");

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
  ],
});

require('dotenv').config();
const token = process.env.token;
const clientId = process.env.clientId;

// Console log
app.listen(1000, () => {
  console.log(`Running bot!`);
});

// List of all commands
const commands = [];
client.commands = new Discord.Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

client.on("ready", () => {
  app.get("/", (req, res) => {
    const guild_ids = client.guilds.cache.map((guild) => guild.id);
    res.send(guild_ids);
  });
});

// Deploy
client.on("ready", () => {
    const guild_ids = client.guilds.cache.map(guild => guild.id);

    const rest = new REST({version: '9'}).setToken(token);
    for (const guildId of guild_ids)
    {
        rest.put(Routes.applicationGuildCommands(clientId, guildId), 
            {body: commands})
        .then(() => console.log('Successfully updated commands for guild ' + guildId))
        .catch(console.error);
    }
});

// Handle Commands
client.on("interactionCreate", async interaction => {
  const rest = new REST({version: '9'}).setToken(token);
  if(!interaction.isCommand()){ 
      return;
  }
  const command = client.commands.get(interaction.commandName);
  if(!command){
      return;
  }

  try{
      await command.execute({client, interaction});
  }
  catch(error){
      console.error(error);rest.put
      await interaction.reply({content: "Sorry little one. Something screwed up. <@512664079496642575> please fix it."});
  }
});

// Login
client.login(token);
