const sqlite3 = require("sqlite3").verbose();
const findRoleEmoji = require("../emoji/findRoleEmoji");
const {processLinkedResults} = require("./processLinkedResults");
const {processMasterLinkedResults} = require("./processMasterLinkedResults");

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
			db.all(`SELECT DISTINCT masterId, type FROM linkedRoles`, [], async (err, results) => {
				if (err) {
					console.error(err);
					reject(err);
					return;
				}

				const {roles, memberRolesIds, subjectRolesIds} = await processMasterLinkedResults({results, guildRoles});
				masterRoles = roles;
				masterMemberRolesIds = memberRolesIds;
				masterSubjectRolesIds = subjectRolesIds;
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

				const {roles, memberRolesIds, subjectRolesIds} = await processLinkedResults({results, guildRoles});
				linkedRoles = roles;
				linkedMemberRolesIds = memberRolesIds;
				linkedSubjectRolesIds = subjectRolesIds;
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
				organisationsMessage += `### __${masterEmoji}<@&${master}> (${masterRoles[master].memberCount}):__\n`;

				const filteredLinkedRoles = linkedMemberRolesIds.filter((role) => linkedRoles[role].masterId == master);

				filteredLinkedRoles.forEach((linked) => {
					const emoji = findRoleEmoji({client, roleId: linked, useEmpty: true});
					organisationsMessage += `- ${emoji} <@&${linked}> (${linkedRoles[linked].memberCount})\n`;
				});
			});
			// Subjects and their masters
			subjectMastersMessage += "## __Subjects__\n";
			masterSubjectRolesIds.forEach((master) => {
				const masterEmoji = findRoleEmoji({client, roleId: master, useEmpty: false});
				subjectMastersMessage += `### __${masterEmoji}<@&${master}> (${masterRoles[master].memberCount}):__\n`;

				const filteredLinkedRoles = linkedSubjectRolesIds.filter((role) => linkedRoles[role].masterId == master);

				filteredLinkedRoles.forEach((linked) => {
					const emoji = findRoleEmoji({client, roleId: linked, useEmpty: true});
					subjectMastersMessage += `- ${emoji} <@&${linked}> (${linkedRoles[linked].memberCount})\n`;
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
