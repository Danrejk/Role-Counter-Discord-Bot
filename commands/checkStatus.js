const { SlashCommandBuilder } = require("@discordjs/builders");
const { statusMessages } = require("../components/statusMessage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("check-status")
        .setDescription("Displays the current count of members of each watched role.")
        .addStringOption(option => option.setName("category").setDescription("(Optional) Roles Category").setRequired(false)
                .addChoices(
                { name: 'Country', value: 'country', description: 'Fully independent countries looking for new players'},
                { name: 'Subject', value: 'subject', description: 'States under independent countries' },
                { name: 'City-State', value: 'city-state', description: 'Fully independent states NOT looking for new players and/or inactive'},
                { name: 'Organisation', value: 'organisation', description: 'Organisations'},
                { name: 'Religion', value: 'religion', description: 'Faith or sets of beliefs'},
                )),
    execute: async ({ client, interaction }) => {
        // SEND MESSAGE
        interactionGuildId = interaction.guild.id
        statusMessages({ client, interactionGuildId })
        .then(async({ countries, city_states, subjects, organisations, religions }) => {
                switch(interaction.options.getString("category")){
                    case "country":
                        fullMessage = countries; break;
                    case "city-state":
                        fullMessage = city_states; break;
                    case "subject":
                        fullMessage = subjects; break;
                    case "organisation":
                        fullMessage = organisations; break;
                    case "religion":
                        fullMessage = religions; break;
                    default: 
                        fullMessage = countries + city_states + subjects + organisations + religions
                }
                await interaction.reply({
                        content: fullMessage,
                        ephemeral: true,
                    });
            })
    }
}
