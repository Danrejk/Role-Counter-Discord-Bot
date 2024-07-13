const sqlite3 = require("sqlite3").verbose();
const findRoleEmoji = require("./emoji/findRoleEmoji");

function statusMessagesLinkedRoles({client, interactionGuildId}) {
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database("./data.db", sqlite3.OPEN_READWRITE, async (err) => {
			if (err) {
				console.error(err);
				reject(err);
				return;
			}

			const guild = client.guilds.cache.get(interactionGuildId);
			await guild.members.fetch();
			const guildRoles = await guild.roles.fetch();

			let organisationsMessage = "-------------------------------------------------------------------}\n";
			let subjectMastersMessage = "-------------------------------------------------------------------}\n";

			// LIST OF MASTER ROLES
			let masterRoles = {};
			let masterMemberRolesIds = [];
			let masterSubjectRolesIds = [];
			db.all(`SELECT DISTINCT masterId, type FROM linkedRoles`, [], (err, results) => {
				if (err) {
					console.error(err);
					reject(err);
					return;
				}

				results.forEach((role) => {
					const guildRole = guildRoles.get(role.masterId);
					// Member Count
					const memberCount = guildRole ? guildRole.members.size : 0;
					// add role to the list
					masterRoles[role.masterId] = {"memberCount": memberCount, "type": role.type};
				});

				// Sort by member count
				let masterRolesSorted = Object.keys(masterRoles);
				masterRolesSorted.sort((roleIdA, roleIdB) => masterRoles[roleIdB].memberCount - masterRoles[roleIdA].memberCount);

				// Sort into categories
				masterRolesSorted.forEach((e) => {
					switch (masterRoles[e].type) {
						case "member":
							masterMemberRolesIds.push(e);
							break;
						case "subject":
							masterSubjectRolesIds.push(e);
							break;
					}
				});
			});

			// LIST OF LINKED ROLES
			let linkedRoles = {};
			let linkedMemberRolesIds = [];
			let linkedSubjectRolesIds = [];
			db.all(`SELECT * FROM linkedRoles WHERE guildId = ?`, [interactionGuildId], async (err, results) => {
				if (err) {
					console.error(err);
					reject(err);
					return;
				}

				for (const role of results) {
					try {
						const guildRole = guildRoles.get(role.roleId);
						// Member Count
						const memberCount = guildRole ? guildRole.members.size : 0;
						// Add role data to rolesData
						linkedRoles[role.roleId] = {
							"masterRole": role.masterId,
							"type": role.type,
							"memberCount": memberCount,
						};
					} catch (err) {
						console.error(err);
					}
				}

				// Sort by member count
				let linkedRolesSorted = Object.keys(linkedRoles);
				linkedRolesSorted.sort((roleIdA, roleIdB) => linkedRoles[roleIdB].memberCount - linkedRoles[roleIdA].memberCount);

				// Sort into categories
				linkedRolesSorted.forEach((e) => {
					switch (linkedRoles[e].type) {
						case "member":
							linkedMemberRolesIds.push(e);
							break;
						case "subject":
							linkedSubjectRolesIds.push(e);
							break;
					}
				});
			});

			// GENERATE MESSAGE
			// fetch emojis
			const emojiGuild = client.guilds.cache.get("1259516467721011250");
			emojiGuild.emojis.cache.clear();
			await emojiGuild.emojis.fetch();

			// Organisations and their members
			organisationsMessage += "## __Members of Organisations__\n";
			masterMemberRolesIds.forEach((master) => {
				const masterEmoji = findRoleEmoji({client, roleId: master, useEmpty: false});
				console.log(linkedMemberRolesIds);

				organisationsMessage += `### __${masterEmoji}<@&${master}> (${masterRoles[master].memberCount}):__\n`;
				linkedMemberRolesIds.forEach((linked) => {
					const emoji = findRoleEmoji({client, roleId: linked, useEmpty: true});
					organisationsMessage += `- ${emoji} <@&${linked}> (${linkedRoles[linked].memberCount})\n`;
				});
			});
			// Subjects and their masters
			subjectMastersMessage += "## __Subjects__\n";
			masterSubjectRolesIds.forEach((master) => {
				const masterEmoji = findRoleEmoji({client, roleId: master, useEmpty: false});

				organisationsMessage += `### __${masterEmoji}<@&${master}> (${masterRoles[master].memberCount}):__\n`;
				linkedSubjectRolesIds.forEach((linked) => {
					const emoji = findRoleEmoji({client, roleId: linked, useEmpty: true});
					organisationsMessage += `- ${emoji} <@&${linked}> (${linkedRoles[linked].memberCount})\n`;
				});
			});

			resolve({
				organisations: organisationsMessage,
				subjectMasters: subjectMastersMessage,
			});
		});
	});
}

module.exports = {statusMessagesLinkedRoles};
