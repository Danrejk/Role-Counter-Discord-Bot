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
        const { countries, city_states, subjects, organisations, religions } = await statusMessages({ client, interactionGuildId });

        const guild = await client.guilds.fetch(interactionGuildId)
        const channels = await guild.channels.fetch();
        for (const message of results) {
            try{
                const channel = channels.get(message.channelId)
                const fetchedMessage = await channel.messages.fetch(message.messageId);

                console.log(message.guildId, message.channelId, message.messageId)

                fetchedMessage.edit(countries + city_states + subjects + organisations + religions)
            } catch (error) {
            console.error(`Error editing message: ${error}`);
            }
        }

        db.close((err) => { if(err) return console.error(err.message) })
    })
}

module.exports = { updateMessages };