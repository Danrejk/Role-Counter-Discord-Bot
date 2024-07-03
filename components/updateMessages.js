const sqlite3 = require("sqlite3").verbose();
const {statusMessages} = require("./statusMessage");

function updateMessages({client, interactionGuildId}) {
	const unixStart = Date.now();

	const db = new sqlite3.Database("./data.db", sqlite3.OPEN_READWRITE, (err) => {
		if (err) return console.errror(err.message);
	});

	db.all(`SELECT * FROM updatedMessages WHERE guildId = ?`, [interactionGuildId], async (err, results) => {
		if (err) {
			console.error(err);
			reject(err);
			return;
		}
		let {countries, city_states, subjects, organisations, religions} = await statusMessages({client, interactionGuildId});

		const guild = await client.guilds.cache.get(interactionGuildId);
		const channels = await guild.channels.fetch();
		for (const message of results) {
			try {
				let channel = channels.get(message.channelId);

				// Check if Status messages are in a thread
				if (message.threadId == null) {
					console.log("Updating in:", message.guildId, message.channelId);
				} else {
					channel = channel.threads.cache.get(message.threadId);
					console.log("Updating:", message.guildId, message.channelId, message.threadId);
					// unarchive thread if it's archived
					if (channel.archived) await channel.setArchived(false);
				}

				await channel.messages.fetch();
				// Update all messages
				fetchedMessage = channel.messages.cache.get(message.countriesMessageId);
				fetchedMessage.edit(countries);
				fetchedMessage = channel.messages.cache.get(message.city_statesMessageId);
				fetchedMessage.edit(city_states);
				fetchedMessage = channel.messages.cache.get(message.subjectsMessageId);
				fetchedMessage.edit(subjects);
				fetchedMessage = channel.messages.cache.get(message.organisationsMessageId);
				fetchedMessage.edit(organisations);
				fetchedMessage = channel.messages.cache.get(message.religionsMessageId);
				fetchedMessage.edit(religions);
			} catch (error) {
				console.error(`Error editing message: ${error}`);
			}
		}

		db.close((err) => {
			if (err) return console.error(err.message);
		});

		unixEnd = Date.now();
		console.log(`Finished updating all watched roles messages in ${(unixEnd - unixStart) / 1000}s`);
	});
}

module.exports = {updateMessages};
