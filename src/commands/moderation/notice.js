const { ERROR, SUCCESS, INFO, CLIPBOARD } = require('../../emojis');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send-notice')
        .setDescription('Sends a private message to a user (Admin only)')
        .addUserOption(option => 
            option.setName('target')
            .setDescription('The user to message')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('message')
            .setDescription('The content of the message')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const target = interaction.options.getUser('target');
        const message = interaction.options.getString('message');
        const noticeEmbed = new EmbedBuilder()
            .setColor('#000000') 
            .setTitle(`${CLIPBOARD} OFFICIAL NOTICE`)
            .setDescription(message) 
            .setTimestamp()
            .setFooter({ text: `${interaction.guild.name}` });

        try {
            await target.send({ embeds: [noticeEmbed] });
            await interaction.editReply({ 
                content: `${SUCCESS} Sent to ${target.tag}.`, 
                ephemeral: true 
            });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ 
                content: `${ERROR} Couldn't send to ${target.tag}. They may have DMs disabled.`, 
                ephemeral: true 
            });
        }
    },
};