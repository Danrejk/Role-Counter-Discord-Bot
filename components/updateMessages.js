const sqlite3 = require('sqlite3').verbose();
const { statusMessages } = require("./statusMessage");

function updateMessages({ client, interactionGuildId }) {
    const db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) =>{
        if (err) return console.errror(err.message);})
        
    db.all(`SELECT * FROM updatedMessages WHERE guildId = ?`, [interactionGuildId], async (err, results) => {
        if (err) {
            console.error(err);
            reject(err);
            return;
        }
        let { countries, city_states, subjects, organisations, religions } = await statusMessages({ client, interactionGuildId });

        const guild = await client.guilds.fetch(interactionGuildId)
        const channels = await guild.channels.fetch();
        console.log(interactionGuildId)
        console.log(results)
        for (const message of results) {
            try{
                let channel = channels.get(message.channelId)

                // Check if Status messages are in a thread
                if(message.threadId == null){
                    console.log("Updating in:", message.guildId, message.channelId)
                }
                else{
                    channel = await channel.threads.fetch(message.threadId)
                    console.log("Updating:", message.guildId, message.channelId, message.threadId)
                }

                // Update all messages
                fetchedMessage = await channel.messages.fetch(message.countriesMessageId);
                fetchedMessage.edit(countries)
                fetchedMessage = await channel.messages.fetch(message.city_statesMessageId);
                fetchedMessage.edit(city_states)
                fetchedMessage = await channel.messages.fetch(message.subjectsMessageId);
                fetchedMessage.edit(subjects)
                fetchedMessage = await channel.messages.fetch(message.organisationsMessageId);
                fetchedMessage.edit(organisations)
                fetchedMessage = await channel.messages.fetch(message.religionsMessageId);
                fetchedMessage.edit(religions)
                
            } catch (error) {
            console.error(`Error editing message: ${error}`);
            }
        }

        db.close((err) => { if(err) return console.error(err.message) })
    })
}

module.exports = { updateMessages };