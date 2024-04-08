const sqlite3 = require('sqlite3').verbose();
const { updateMessages } = require("./updateMessages")

function unwatchDeletedRoles({ client, interactionGuildId, deletedRoleId }) {
    console.log(deletedRoleId)

    const db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) =>{
        if (err) return console.errror(err.message);})
        
        db.run(`DELETE FROM watchedRoles WHERE roleId = ?`, [deletedRoleId]);

        updateMessages({ client, interactionGuildId })
        console.log(`Removed the role ${deletedRoleId} from the Watch List in guild ${interactionGuildId}.`);

        db.close((err) => { if(err) return console.error(err.message) })
    }

module.exports = { unwatchDeletedRoles };