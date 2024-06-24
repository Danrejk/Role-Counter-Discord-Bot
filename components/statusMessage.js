const sqlite3 = require("sqlite3").verbose();

function statusMessages({ client, interactionGuildId }) {
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database(
			"./data.db",
			sqlite3.OPEN_READWRITE,
			(err) => {
				if (err) {
					console.error(err);
					reject(err);
					return;
				}

				let countriesMessage =
					"-------------------------------------------------------------------}\n";
				let city_statesMessage =
					"-------------------------------------------------------------------}\n";
				let subjectsMessage =
					"-------------------------------------------------------------------}\n";
				let organisationsMessage =
					"-------------------------------------------------------------------}\n";
				let religionsMessage =
					"-------------------------------------------------------------------}\n";

				db.all(
					`SELECT * FROM watchedRoles WHERE guildId = ?`,
					[interactionGuildId],
					async (err, results) => {
						if (err) {
							console.error(err);
							reject(err);
							return;
						}
						let rolesData = {};

						// fetch needed all data
						const guild =
							await client.guilds.fetch(interactionGuildId);
						await guild.members.fetch();

						const guildRoles = await guild.roles.fetch();

						for (const role of results) {
							try {
								const guildRole = guildRoles.get(role.roleId);
								// Member Count
								const memberCount = guildRole
									? guildRole.members.size
									: 0;

								// Add role data to rolesData
								rolesData[role.roleId] = {
									memberCount: memberCount,
									category: role.category,
									leader: role.leader,
								};
							} catch (err) {
								console.error(err);
							}
						}

						// Sort by member count
						let roleIdsSorted = Object.keys(rolesData);
						roleIdsSorted.sort(
							(roleIdA, roleIdB) =>
								rolesData[roleIdB].memberCount -
								rolesData[roleIdA].memberCount
						);

						// Sort into categories
						countryList = [];
						city_stateList = [];
						subjectList = [];
						organisationList = [];
						religionList = [];

						roleIdsSorted.forEach((e) => {
							//console.log(rolesData[e])
							switch (rolesData[e].category) {
								case "country":
									countryList.push(e);
									break;
								case "city-state":
									city_stateList.push(e);
									break;
								case "subject":
									subjectList.push(e);
									break;
								case "organisation":
									organisationList.push(e);
									break;
								case "religion":
									religionList.push(e);
									break;
							}
						});

						// GENERATE MESSAGE
						// Countries
						countriesMessage += "## __Countries__\n";
						countryList.forEach((e) => {
							countriesMessage += `- <@&${e}> - ${rolesData[e].leader ?? "*none*"} (${rolesData[e].memberCount})\n`;
						});
						// City-States
						city_statesMessage += "## __City-States__\n";
						city_stateList.forEach((e) => {
							city_statesMessage += `- <@&${e}> - ${rolesData[e].leader ?? "*none*"} (${rolesData[e].memberCount})\n`;
						});
						// Subjects
						subjectsMessage += "## __Subjects__\n";
						subjectList.forEach((e) => {
							subjectsMessage += `- <@&${e}> - ${rolesData[e].leader ?? "*none*"} (${rolesData[e].memberCount})\n`;
						});
						// Organisations
						organisationsMessage += "## __Organisations__\n";
						organisationList.forEach((e) => {
							organisationsMessage += `- <@&${e}> - ${rolesData[e].leader ?? "*none*"} (${rolesData[e].memberCount})\n`;
						});
						// Religions
						religionsMessage += "## __Religions__\n";
						religionList.forEach((e) => {
							religionsMessage += `- <@&${e}> - ${rolesData[e].leader ?? "*none*"} (${rolesData[e].memberCount})\n`;
						});

						resolve({
							countries: countriesMessage,
							city_states: city_statesMessage,
							subjects: subjectsMessage,
							organisations: organisationsMessage,
							religions: religionsMessage,
						});
					}
				);
			}
		);
	});
}

module.exports = { statusMessages };
