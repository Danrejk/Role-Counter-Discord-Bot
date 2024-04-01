const { SlashCommandBuilder } = require("@discordjs/builders");
const { statusMessages } = require("../statusMessage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("check-status")
        .setDescription("Displays the current count of members of each watched role."),
    execute: async ({ client, interaction }) => {
        // SEND MESSAGE
        statusMessages({ client, interaction })
                .then(async({ countries, city_states, subjects, organisations, religions }) => {
                        await interaction.reply({
                                content: countries + city_states + subjects + organisations + religions,
                                ephemeral: true,
                            });
                    })
    }
}
