const sqlite3 = require("sqlite3").verbose();

function updateLeaders({client, interactionGuildId}) {
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database("./data.db", sqlite3.OPEN_READWRITE, (err) => {
			if (err) {
				console.error(err);
				reject(err);
				return;
			}

			db.all(
				`SELECT leader FROM watchedRoles WHERE guildId = ? AND (category = "country" OR category = "city-state")`,
				[interactionGuildId],
				async (err, results) => {
					if (err) {
						console.error(err);
						reject(err);
						return;
					}
					// const leaderRoleId = "696628197122637849";
					const leaderRoleId = "1254882374177525871";

					// fetch all needed data
					const guild = await client.guilds.cache.get(interactionGuildId);
					await guild.members.fetch();

					let leaderList = [];

					for (const leader of results) {
						const regex = /<@(\d+)/g;
						let match;

						while ((match = regex.exec(leader.leader))) {
							leaderList.push(match[1]);
						}
					}

					for (const leaderId of leaderList) {
						try {
							const leader = guild.members.cache.get(leaderId);
							if (leader) {
								// Add the role to the member
								await leader.roles.add(leaderRoleId);
							} else {
								console.warn(`User with ID ${leaderId} not found in guild`);
							}
						} catch (err) {
							console.error("Error while giving the leader role:", err);
						}
					}

					// GENERATE MESSAGE
					// Countries
					// countriesMessage += "## __Countries__\n";
					// countryList.forEach((e) => {
					// 	countriesMessage += `- <@&${e}> - ${rolesData[e].leader ?? "*none*"} (${rolesData[e].memberCount})\n`;
					// });

					// resolve({
					// 	countries: countriesMessage,
					// });
				}
			);
		});
	});
}

module.exports = {updateLeaders};
