const express = require("express");
const app = express();
const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');

const fs = require("fs");
const path = require("path");

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
  ],
});

app.listen(1000, () => {
  console.log(`Running bot with token ${process.env.token}`);
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

    const rest = new REST({version: '9'}).setToken(process.env.token);
    for (const guildId of guild_ids)
    {
        rest.put(Routes.applicationGuildCommands(process.env.clientId, guildId), 
            {body: commands})
        .then(() => console.log('Successfully updated commands for guild ' + guildId))
        .catch(console.error);
    }
});

// Login
client.login(process.env.token);
