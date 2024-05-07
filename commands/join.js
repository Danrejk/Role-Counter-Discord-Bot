const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require("discord-api-types/v10");
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Join the vc you are in for the lolz")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	execute: async ({ client, interaction }) => {
        const member = interaction.member;
        const voiceChannel = member.voice.channel;
    
        if (voiceChannel) {
        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });
            sentMessage = await interaction.reply({content: "Did it", ephemeral: true});

        } catch (error) {
            console.error(`Error joining voice channel: ${error}`);
        }
        } else {
            // Member is not in a voice channel
            interaction.reply({content: "You need to be in a voice channel for this command.", ephemeral: true});
        }
	},
}