const { ERROR, SUCCESS } = require('../../emojis');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'react',
    description: 'React to a message with a given emoji (admin only)',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply(`${ERROR} Admin only.`);
        }

        const [msgId, emoji] = args;
        if (!msgId || !emoji) {
            return message.reply(`${ERROR} Usage: \`x!react <msgid> <emoji>\``);
        }

        try {
            const targetMessage = await message.channel.messages.fetch(msgId);
            await targetMessage.react(emoji);

            await message.delete().catch(() => {});
            const confirmation = await message.channel.send({
                content: `${SUCCESS} Reacted with ${emoji} successfully.`,
            });
            setTimeout(() => confirmation.delete().catch(() => {}), 4000);
        } catch (err) {
            console.error('React command error:', err);
            const errorMsg = await message.reply(`${ERROR} Could not react \u2014 check the message ID and emoji are valid, and that the message is in this channel.`);
            setTimeout(() => errorMsg.delete().catch(() => {}), 4000);
        }
    }
};


