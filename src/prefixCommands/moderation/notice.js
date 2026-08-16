const { CLIPBOARD, ERROR, SUCCESS } = require('../../emojis');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'send-notice',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply('You do not have permission to use this command.');
        }

        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('Please mention a user to message.');
        }

        const noticeMessage = args.slice(1).join(' ');
        if (!noticeMessage) {
            return message.reply('Please provide the content of the message.');
        }

        const noticeEmbed = new EmbedBuilder()
            .setColor('#000000')
            .setTitle(`${CLIPBOARD} OFFICIAL NOTICE`)
            .setDescription(noticeMessage)
            .setTimestamp()
            .setFooter({ text: `Automated Notification \u2014 ${message.guild.name}` });

        try {
            await target.send({ embeds: [noticeEmbed] });
            await message.reply(`${SUCCESS} Message sent successfully to ${target.tag}!`);
        } catch (error) {
            console.error(error);
            await message.reply(`${ERROR} Could not send message to ${target.tag}. They might have DMs disabled.`);
        }
    },
};
