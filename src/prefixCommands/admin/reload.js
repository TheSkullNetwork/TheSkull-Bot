const { ERROR, SUCCESS } = require('../../emojis');
const { PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

function findCommandFile(dir, commandName) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const found = findCommandFile(fullPath, commandName);
            if (found) return found;
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
            try {
                const command = require(fullPath);
                if (command.data && command.data.name === commandName) return fullPath;
            } catch (e) {  }
        }
    }
    return null;
}

module.exports = {
    name: 'reload',
    description: 'Hot-reload a slash command without restarting the bot (admin only)',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply(`${ERROR} Admin only.`);
        }

        const commandName = (args[0] || '').toLowerCase();
        if (!commandName) {
            return message.reply(`${ERROR} Usage: \`x!reload <commandname>\``);
        }

        const commandsPath = path.join(__dirname, '..', '..', 'commands');
        const filePath = findCommandFile(commandsPath, commandName);

        if (!filePath) {
            return message.reply(`${ERROR} No command found named \`${commandName}\`.`);
        }

        try {
            delete require.cache[require.resolve(filePath)];
            const newCommand = require(filePath);

            if (!('data' in newCommand) || !('execute' in newCommand)) {
                return message.reply(`${ERROR} \`${commandName}\` is missing "data" or "execute" after reload.`);
            }

            message.client.commands.set(newCommand.data.name, newCommand);
            return message.reply(`${SUCCESS} Reloaded \`${commandName}\`.`);
        } catch (err) {
            console.error(`Reload error for ${commandName}:`, err);
            return message.reply(`${ERROR} Failed to reload \`${commandName}\`: ${err.message}`);
        }
    }
};

