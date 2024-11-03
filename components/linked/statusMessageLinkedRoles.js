const sqlite3 = require("sqlite3").verbose();
const findRoleEmoji = require("../emoji/findRoleEmoji");
const {getLinkedRoles} = require("./getLinkedRoles");
const {getMasterRoles} = require("./getMasterRoles");

function statusMessagesLinkedRoles({client, interactionGuildId}) {
	return new Promise(async (resolve, reject) => {
		let organisationsMessage = "-------------------------------------------------------------------}\n";
		let subjectMastersMessage = "-------------------------------------------------------------------}\n";

		// LIST OF MASTER ROLES
		const {
			roles: masterRoles,
			memberRolesIds: masterMemberRolesIds,
			subjectRolesIds: masterSubjectRolesIds,
		} = await getMasterRoles({client, interactionGuildId});

		// LIST OF LINKED ROLES
		const {
			roles: linkedRoles,
			memberRolesIds: linkedMemberRolesIds,
			subjectRolesIds: linkedSubjectRolesIds,
		} = await getLinkedRoles({client, interactionGuildId});

		// GENERATE MESSAGE
		// fetch emojis
		const emojiGuild = client.guilds.cache.get("1259516467721011250");
		emojiGuild.emojis.cache.clear();
		await emojiGuild.emojis.fetch();

		// Organisations and their members
		organisationsMessage += "## __Members of Organisations__\n";
		let organisationsMessageOverflow = "";
		masterMemberRolesIds.forEach((master) => {
			const masterEmoji = findRoleEmoji({client, roleId: master, useEmpty: false});
			organisationsMessage += `### __${masterEmoji}<@&${masterRoles[master].masterId}> (${masterRoles[master].memberCount}):__\n`;

			const filteredLinkedRoles = linkedMemberRolesIds.filter((role) => linkedRoles[role].masterId == masterRoles[master].masterId);

			filteredLinkedRoles.forEach((linked) => {
				// const emoji = findRoleEmoji({client, roleId: linkedRoles[linked].roleId, useEmpty: true});
				// roleLine = `- ${emoji} <@&${linkedRoles[linked].roleId}> (${linkedRoles[linked].memberCount})\n`;
				roleLine = `- <@&${linkedRoles[linked].roleId}> (${linkedRoles[linked].memberCount})\n`;
				if (organisationsMessage.length + roleLine.length >= 2000 || organisationsMessageOverflow != "") {
					organisationsMessageOverflow += roleLine;
				} else {
					organisationsMessage += roleLine;
				}
			});
		});
		// Subjects and their masters
		subjectMastersMessage += "## __Subjects__\n";
		let subjectMastersMessageOverflow = "";
		masterSubjectRolesIds.forEach((master) => {
			// const masterEmoji = findRoleEmoji({client, roleId: master, useEmpty: false});
			// subjectMastersMessage += `### __${masterEmoji}<@&${masterRoles[master].masterId}> (${masterRoles[master].memberCount}):__\n`;
			subjectMastersMessage += `### __<@&${masterRoles[master].masterId}> (${masterRoles[master].memberCount}):__\n`;

			const filteredLinkedRoles = linkedSubjectRolesIds.filter((role) => linkedRoles[role].masterId == masterRoles[master].masterId);

			filteredLinkedRoles.forEach((linked) => {
				// const emoji = findRoleEmoji({client, roleId: linkedRoles[linked].roleId, useEmpty: true});
				// roleLine = `- ${emoji} <@&${linkedRoles[linked].roleId}> (${linkedRoles[linked].memberCount})\n`;
				roleLine = `- <@&${linkedRoles[linked].roleId}> (${linkedRoles[linked].memberCount})\n`;

				if (subjectMastersMessage.length + roleLine.length >= 2000 || subjectMastersMessageOverflow != "") {
					subjectMastersMessageOverflow += roleLine;
				} else {
					subjectMastersMessage += roleLine;
				}
			});
		});

		// combine messages if there's overflow
		if (subjectMastersMessageOverflow != "") {
			subjectMastersMessage = [subjectMastersMessage, subjectMastersMessageOverflow];
		}
		if (organisationsMessageOverflow != "") {
			organisationsMessage = [organisationsMessage, organisationsMessageOverflow];
		}

		resolve({
			organisations: organisationsMessage,
			subjectMasters: subjectMastersMessage,
		});
	});
}
module.exports = {statusMessagesLinkedRoles};
