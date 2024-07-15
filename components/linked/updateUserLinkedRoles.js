const {getLinkedRoles} = require("./getLinkedRoles");

async function updateUserLinkedroles({client, interactionGuildId, userId}) {
	const guild = client.guilds.cache.get(interactionGuildId);
	await guild.members.fetch();
	const guildRoles = await guild.roles.fetch();

	const user = guild.members.cache.get(userId);
	const userRoles = await user.roles.cache;

	let givenMasterRoles = [];

	const {roles, memberRolesIds, subjectRolesIds} = await getLinkedRoles({client, interactionGuildId});

	for (const role of memberRolesIds) {
		// check if user has one of the linked roles
		if (userRoles.has(role) && !givenMasterRoles.includes(roles[role].masterId)) {
			await user.roles.add(roles[role].masterId);
			givenMasterRoles.push(roles[role].masterId);
		}
	}
	for (const role of subjectRolesIds) {
		// check if user has one of the linked roles
		if (userRoles.has(role)) {
			await user.roles.add(roles[role].masterId);
		}
	}
}

module.exports = {updateUserLinkedroles};
