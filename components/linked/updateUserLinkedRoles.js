const {getLinkedRoles} = require("./getLinkedRoles");
const {getMasterRoles} = require("./getMasterRoles");

async function updateUserLinkedroles({client, interactionGuildId, user}) {
	const userRoles = user.roles.cache;

	const {roles, memberRolesIds, subjectRolesIds} = await getLinkedRoles({client, interactionGuildId});
	const {roles: masterRoles, memberRolesIds: masterMemberRolesIds} = await getMasterRoles({client, interactionGuildId});

	console.log("start", masterMemberRolesIds);
	// ORGANISATIONS
	// TO DO: This needs optimalisation
	for (const role of memberRolesIds) {
		// check if user has one of the linked roles
		// const notAlreadyGiven = masterMemberRolesIds.find((index) => masterRoles[index].masterId == roles[role].masterId);
		// console.log(roles[role].roleId, notAlreadyGiven, roles[role].type);

		// if (userRoles.has(roles[role].roleId) && notAlreadyGiven) {
		if (userRoles.has(roles[role].roleId)) {
			await user.roles.add(roles[role].masterId);

			const notAlreadyGiven = masterMemberRolesIds.find((master) => masterRoles[master].masterId == roles[role].masterId);
			// console.log("i want removed", notAlreadyGiven);

			const indexToRemove = masterMemberRolesIds.indexOf(notAlreadyGiven);
			// console.log("removing index", indexToRemove);
			if (indexToRemove != -1) masterMemberRolesIds.splice(indexToRemove, 1);
		}
	}

	// remove all excess organisation roles
	console.log("excess", masterMemberRolesIds);
	for (const remainingMasterRole of masterMemberRolesIds) {
		await user.roles.remove(masterRoles[remainingMasterRole].masterId);
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
