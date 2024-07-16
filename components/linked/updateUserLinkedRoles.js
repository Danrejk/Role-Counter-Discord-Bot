const {getLinkedRoles} = require("./getLinkedRoles");
const {getMasterRoles} = require("./getMasterRoles");

async function updateUserLinkedroles({client, interactionGuildId, userId}) {
	const guild = client.guilds.cache.get(interactionGuildId);
	const user = guild.members.cache.get(userId);
	const userRoles = await user.roles.cache;

	const {roles, memberRolesIds, subjectRolesIds} = await getLinkedRoles({client, interactionGuildId});
	const {memberRolesIds: masterMemberRolesIds} = await getMasterRoles({client, interactionGuildId});

	// ORGANISATIONS
	for (const role of memberRolesIds) {
		// check if user has one of the linked roles
		if (userRoles.has(roles[role].roleId) && masterMemberRolesIds.includes(roles[role].masterId)) {
			await user.roles.add(roles[role].masterId);

			const indexToRemove = masterMemberRolesIds.indexOf(roles[role].masterId);
			masterMemberRolesIds.splice(indexToRemove, 1);
		}
	}
	// remove all excess organisation roles
	for (const remainingMasterRole of masterMemberRolesIds) {
		await user.roles.remove(remainingMasterRole);
	}

	// SUBJECTS
	for (const role of subjectRolesIds) {
		// check if user has one of the linked roles
		if (userRoles.has(roles[role].roleId)) {
			await user.roles.add(roles[role].masterId);
		}
	}
}

module.exports = {updateUserLinkedroles};
