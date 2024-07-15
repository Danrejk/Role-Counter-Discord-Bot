const sqlite3 = require("sqlite3").verbose();

function getLinkedRoles({client, interactionGuildId}) {
	return new Promise(async (resolve, reject) => {
		const db = new sqlite3.Database("./data.db", sqlite3.OPEN_READ, (err) => {
			if (err) return console.error(err.message);
		});

		const guild = client.guilds.cache.get(interactionGuildId);
		await guild.members.fetch();
		const guildRoles = await guild.roles.fetch();

		db.all(`SELECT roleId, masterId, type FROM linkedRoles WHERE guildId = ?`, [interactionGuildId], async (err, results) => {
			if (err) {
				console.error(err);
				reject(err);
				return;
			}
			let roles = {};
			let memberRolesIds = [];
			let subjectRolesIds = [];

			for (const role of results) {
				try {
					const guildRole = guildRoles.get(role.roleId);
					// Member Count
					const memberCount = guildRole ? guildRole.members.size : 0;
					// Add role data to rolesData
					roles[role.roleId] = {
						"masterId": role.masterId,
						"type": role.type,
						"memberCount": memberCount,
					};
				} catch (err) {
					console.error(err);
				}
			}

			// Sort by member count
			let rolesSorted = Object.keys(roles);
			rolesSorted.sort((roleIdA, roleIdB) => roles[roleIdB].memberCount - roles[roleIdA].memberCount);

			// Sort into categories
			rolesSorted.forEach((e) => {
				switch (roles[e].type) {
					case "member":
						memberRolesIds.push(e);
						break;
					case "subject":
						subjectRolesIds.push(e);
						break;
				}
			});

			// Return values
			resolve({roles, memberRolesIds, subjectRolesIds});
		});
	});
}

module.exports = {getLinkedRoles};
