const express = require("express");
const app = express();
const Discord = require("discord.js");
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
const {AuditLogEvent} = require("discord.js");

const fs = require("fs");
const path = require("path");

const {updateMessages} = require("./components/updateMessages");
const {updateAllEmojis} = require("./components/updateAllEmojis");
const {unwatchDeletedRoles} = require("./components/unwatchDeletedRoles");
const desiredRoles = require("./components/desiredRoles");

const color = "\x1b[35m";
const colorReset = "\x1b[0m";

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
	const guilds = client.guilds.cache;

	const rest = new REST({version: "9"}).setToken(token);
	for (const guild of guilds) {
		rest.put(Routes.applicationGuildCommands(clientId, guild[1].id), {body: commands})
			.then(() => console.log(`${color}[${guild[1].name}]${colorReset} Successfully updated commands.`))
			.then(() => updateAllEmojis({client, interactionGuildId: guild[1].id, compileUpdates: true}))
			.catch(console.error);
	}
	for (const guild of guilds) {
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
		await interaction.channel.send({
			content: "Sorry little one. Something screwed up. Tag <@512664079496642575> so he can fix it.",
		});
	}
});

// Error Handler
process.on("uncaughtException", (error) => {
	console.error(error);
});

process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Listen for role member changes of roles starting with set symbols
client.on("guildMemberUpdate", async (oldMember, newMember) => {
	const oldRoles = oldMember.roles.cache;
	const newRoles = newMember.roles.cache;

	const addedRole = [...newRoles.filter((role) => !oldRoles.has(role.id))][0]?.[1].name;
	const removedRole = [...oldRoles.filter((role) => !newRoles.has(role.id))][0]?.[1].name;

	let executorId = await newMember.guild.fetchAuditLogs({
		limit: 1,
		type: AuditLogEvent.MemberRoleUpdate,
	});
	executorId = executorId.entries.map((entry) => entry.executorId)[0];

	if ((desiredRoles(addedRole) || desiredRoles(removedRole)) && executorId != "1223751197131804742") {
		const interactionGuildId = newMember.guild.id;
		updateMessages({client, interactionGuildId});
	}
});

// Listen for removed roles
client.on("roleDelete", (deletedRole) => {
	console.log(`The role ${deletedRole.name} has been removed from the server.`);
	let deletedRoleId = deletedRole.id;
	const interactionGuildId = deletedRole.guild.id;
	unwatchDeletedRoles({client, interactionGuildId, deletedRoleId});
});

// Login
client.login(token);
