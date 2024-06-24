const express = require("express");
const app = express();
const Discord = require("discord.js");
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");

const fs = require("fs");
const path = require("path");

const {updateMessages} = require("./components/updateMessages");
const {unwatchDeletedRoles} = require("./components/unwatchDeletedRoles");

const client = new Discord.Client({
	allowedMentions: {parse: []},
	intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.GuildMembers,
		Discord.GatewayIntentBits.GuildModeration,
	],
});

require("dotenv").config();
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
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
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
	const guild_ids = client.guilds.cache.map((guild) => guild.id);

	const rest = new REST({version: "9"}).setToken(token);
	for (const guildId of guild_ids) {
		rest.put(Routes.applicationGuildCommands(clientId, guildId), {body: commands})
			.then(() => console.log("Successfully updated commands for guild " + guildId))
			.catch(console.error);
	}
});

// Handle Commands
client.on("interactionCreate", async (interaction) => {
	const rest = new REST({version: "9"}).setToken(token);
	if (!interaction.isCommand()) {
		return;
	}
	const command = client.commands.get(interaction.commandName);
	if (!command) {
		return;
	}

	try {
		await command.execute({client, interaction});
	} catch (error) {
		console.error(error);
		rest.put;
		await interaction.channel.send({content: "Sorry little one. Something screwed up. <@512664079496642575> please fix it."});
	}
});

// Listen for role member changes of roles starting with set symbols
client.on("guildMemberUpdate", (oldMember, newMember) => {
	const roleSymbols = [`"`, `'`, `[`, `{`];
	const interactionGuildId = newMember.guild.id;
	const oldRoles = oldMember.roles.cache;
	const newRoles = newMember.roles.cache;

	const addedRole = [...newRoles.filter((role) => !oldRoles.has(role.id))][0]?.[1].name;
	const removedRole = [...oldRoles.filter((role) => !newRoles.has(role.id))][0]?.[1].name;

	if (roleSymbols.includes(addedRole?.[0]) || roleSymbols.includes(removedRole?.[0])) {
		updateMessages({client, interactionGuildId});
	}
});

// Listen for removed roles
client.on("roleDelete", (deletedRole) => {
	console.log(`The role ${deletedRole.name} has been removed from the server.`);
	let deletedRoleId = deletedRole.id;
	unwatchDeletedRoles({client, interactionGuildId, deletedRoleId});
});

// Login
client.login(token);
