const sqlite3 = require("sqlite3").verbose();

function updateLeaders({client, interactionGuildId}) {
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database("./data.db", sqlite3.OPEN_READWRITE, (err) => {
			if (err) {
				console.error(err);
				reject(err);
				return;
			}

			const unixStart = Date.now();

			db.all(
				`SELECT leader FROM watchedRoles WHERE guildId = ? AND (category = "country" OR category = "city-state")`,
				[interactionGuildId],
				async (err, results) => {
					if (err) {
						console.error(err);
						reject(err);
						return;
					}
					const leaderRoleId = "696628197122637849";
					// const leaderRoleId = "1254882374177525871"; //testing server

					// fetch all needed data
					const guild = client.guilds.cache.get(interactionGuildId);
					await guild.members.fetch();

					// Give the leader role to every member from the list
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
								if (!leader.roles.cache.has(leaderRoleId)) {
									await leader.roles.add(leaderRoleId);
									console.log(`Leader role added to ${leader.user.tag}`);
								}
							} else {
								console.warn(`User with ID ${leaderId} not found on the server`);
							}
						} catch (err) {
							console.error("Error while giving the leader role:", err);
						}
					}

					// Remove role from every member not on the list
					guild.members.cache.forEach(async (leader) => {
						try {
							if (!leaderList.includes(leader.id)) {
								if (leader.roles.cache.has(leaderRoleId)) {
									await leader.roles.remove(leaderRoleId);
									console.log(`Leader role removed from ${leader.user.tag}`);
								}
							}
						} catch (err) {
							console.error(`Error removing the leader role from user with ID ${leader.id}:`, err);
						}
					});

					unixEnd = Date.now();
					console.log(`Finished updating leader roles in ${(unixEnd - unixStart) / 1000}s`);
				}
			);
		});
	});
}

module.exports = {updateLeaders};
