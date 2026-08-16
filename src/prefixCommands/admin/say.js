const { ERROR } = require('../../emojis');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'say',
    description: 'Make the bot send a message as itself (admin only)',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply(`${ERROR} Admin only.`);
        }

        const text = args.join(' ');
        if (!text) {
            return message.reply(`${ERROR} Usage: \`x!say <text>\``);
        }

        try {
            await message.delete().catch(() => {});
            await message.channel.send(text);
        } catch (err) {
            console.error('Say command error:', err);
            message.reply(`${ERROR} Failed to send the message.`).catch(() => {});
        }
    }
};


