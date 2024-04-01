const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord-api-types/v10");
const { updateMessages } = require("../components/updateMessages");

module.exports = {
	data: new SlashCommandBuilder()
                .setName("manual-update")
                .setDescription("Creates a message showing the current count of players with watched roles.")
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
	execute: async ({ client, interaction }) => {
                // Interaction Reply
                await interaction.reply({
                        content: "Updated all Role Member Counters!",
                        ephemeral: true,
                });

                interactionGuildId = interaction.guild.id
                updateMessages({ client, interactionGuildId })
	},
}