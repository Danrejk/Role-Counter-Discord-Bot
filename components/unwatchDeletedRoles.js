const sqlite3 = require("sqlite3").verbose();
const {updateMessages} = require("./updateMessages");
const {removeRemovedRolesEmojis} = require("./emoji/removeRemovedRolesEmojis");

const color = "\x1b[35m";
const colorReset = "\x1b[0m";

function unwatchDeletedRoles({client, interactionGuildId, deletedRoleId}) {
	const guildName = client.guilds.cache.get(interactionGuildId).name;

	const db = new sqlite3.Database("./data.db", sqlite3.OPEN_READWRITE, (err) => {
		if (err) return console.errror(err.message);
	});

	db.run(`DELETE FROM watchedRoles WHERE roleId = ?`, [deletedRoleId], async function (err) {
		if (err) {
			console.error(err.message);
			return;
		}

		if (this.changes === 0) {
			console.log(`${deletedRoleId} wasn't on the watch list`);
			return;
		}

		removeRemovedRolesEmojis({client, interactionGuildId, removedRole: deletedRoleId});
		updateMessages({client, interactionGuildId});
		console.log(`${color}[${guildName}]${colorReset} Removed the role ${deletedRoleId} from the Watch List.`);
	});

	db.close((err) => {
		if (err) return console.error(err.message);
	});
}

module.exports = {unwatchDeletedRoles};
