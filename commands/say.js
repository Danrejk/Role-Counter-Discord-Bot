const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require("discord-api-types/v10");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Nie dla psa kiełbasa")
        .addStringOption(option =>
            option.setName("tresc").setDescription("co mam wówić złotko").setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
	execute: async ({ client, interaction }) => {
        // if (interaction.user.id === '512664079496642575'){
                let tresc = interaction.options.getString("tresc")
                await interaction.channel.send({content: tresc});
        // }
        // else{
        //         await interaction.reply({content:"Bredzisz głupoty. Nie powiem tego.", ephemeral: true});
        // }
        sentMessage = await interaction.reply({content:"Did it", ephemeral: true});
        sentMessage.delete()
	},
}