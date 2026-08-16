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
            .setFooter({ text: `Automated Notification \u2014 ${interaction.guild.name}` });

        try {
            await target.send({ embeds: [noticeEmbed] });
            await interaction.editReply({ 
                content: `${SUCCESS} Message sent successfully to ${target.tag}!`, 
                ephemeral: true 
            });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ 
                content: `${ERROR} Could not send message to ${target.tag}. They might have DMs disabled.`, 
                ephemeral: true 
            });
        }
    },
};