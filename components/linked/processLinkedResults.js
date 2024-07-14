async function processLinkedResults({results, guildRoles}) {
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

	return {roles, memberRolesIds, subjectRolesIds};
}

module.exports = {processLinkedResults};
