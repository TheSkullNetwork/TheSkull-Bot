const { ERROR } = require('../../emojis');
const { PREFIXES } = require('../../config');
const { checkReturn, notifyMentions } = require('../../handlers/afk');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        const matchedPrefix = PREFIXES.find(p => message.content.toLowerCase().startsWith(p));
        const isAfkCommand = matchedPrefix && message.content.toLowerCase().startsWith(`${matchedPrefix}afk`);

        await checkReturn(message, isAfkCommand);
        await notifyMentions(message);

        if (!matchedPrefix) return;
        const args = message.content.slice(matchedPrefix.length).trim().split(/\s+/);
        const commandName = args.shift().toLowerCase();
        const command = message.client.prefixCommands.get(commandName);
        if (!command) return;

        try {
            await command.execute(message, args);
        } catch (err) {
            console.error(`Prefix command error (${commandName}):`, err);
            message.reply(`${ERROR} There was an error running that command.`).catch(() => {});
        }
    }
};
