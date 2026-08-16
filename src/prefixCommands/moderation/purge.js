const { ERROR, SUCCESS } = require('../../emojis');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'purge',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply(`${ERROR} You need the Manage Messages permission to use this.`);
        }

        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 1 || amount > 100) {
            return message.reply(`${ERROR} Please enter a number between 1 and 100.`);
        }

        try {
            await message.delete().catch(() => {});
            const deleted = await message.channel.bulkDelete(amount, true);

            const confirmation = await message.channel.send(`${SUCCESS} Deleted ${deleted.size} messages.`);
            setTimeout(() => confirmation.delete().catch(() => {}), 4000);
        } catch (err) {
            console.error('Purge error:', err);
            message.channel.send(`${ERROR} Failed to delete messages. Messages older than 14 days cannot be bulk deleted.`);
        }
    }
};

