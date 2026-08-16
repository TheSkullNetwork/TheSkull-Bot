const { ERROR, SUCCESS } = require('../../emojis');
const { PermissionFlagsBits } = require('discord.js');
const { warnings } = require('../../database/database.js');

module.exports = {
    name: 'remove-warn',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply('You do not have permission to use this command.');
        }

        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('Please mention a user to modify.');
        }

        const userWarnings = warnings.get(target.id);
        if (!userWarnings || !userWarnings.length) {
            return message.reply(`${ERROR} ${target.username} has no warnings.`);
        }

        
        const hasAll = args.some(arg => arg.toLowerCase() === 'all');
        if (hasAll) {
            warnings.clearAll(target.id);
            return message.reply(`${SUCCESS} All warnings cleared for **${target.username}**.`);
        }

        
        const indexArg = args.find(arg => !arg.startsWith('<@') && !isNaN(arg));
        const index = indexArg ? parseInt(indexArg) : null;

        if (!index) {
            return message.reply(`${ERROR} Provide a warning index number or type \`all\` to clear all warnings.`);
        }

        const removed = warnings.remove(target.id, index);
        if (!removed) {
            return message.reply(`${ERROR} Invalid warning number. Use your check-warn command to see valid warning numbers.`);
        }

        await message.reply(`${SUCCESS} Removed warning #${index} from **${target.username}**: "${removed.reason}"`);
    }
};
