const sqlite3 = require("sqlite3").verbose();

async function getMasterRoles({client, interactionGuildId}) {
	return new Promise(async (resolve, reject) => {
		const db = new sqlite3.Database("./data.db", sqlite3.OPEN_READ, (err) => {
			if (err) return console.error(err.message);
		});

		const guild = client.guilds.cache.get(interactionGuildId);
		await guild.members.fetch();
		const guildRoles = await guild.roles.fetch();

		db.all(`SELECT DISTINCT masterId, type FROM linkedRoles WHERE guildId = ?`, [interactionGuildId], async (err, results) => {
			if (err) {
				console.error(err);
				reject(err);
				return;
			}

			let roleLinks = [];
			let memberRolesIndexes = [];
			let subjectRolesIndexes = [];

			for (const role of results) {
				try {
					const guildRole = guildRoles.get(role.masterId);
					// Member Count
					const memberCount = guildRole ? guildRole.members.size : 0;
					// Add role data to rolesData
					roleLinks.push({
						"masterId": role.masterId,
						"type": role.type,
						"memberCount": memberCount,
					});
				} catch (err) {
					console.error(err);
				}
			}

			// Sort into categories
			for (const e in roleLinks) {
				switch (roleLinks[e].type) {
					case "member":
						memberRolesIndexes.push(e);
						break;
					case "subject":
						subjectRolesIndexes.push(e);
						break;
				}
			}

			// Sort by member count
			memberRolesIndexes.sort((indexA, indexB) => roleLinks[indexB].memberCount - roleLinks[indexA].memberCount);
			subjectRolesIndexes.sort((indexA, indexB) => roleLinks[indexB].memberCount - roleLinks[indexA].memberCount);

			// Return values
			resolve({roles: roleLinks, memberRolesIds: memberRolesIndexes, subjectRolesIds: subjectRolesIndexes});
		});
	});
}

module.exports = {getMasterRoles};
