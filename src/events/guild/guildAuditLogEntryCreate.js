const { MOD_LOG_CHANNEL_ID } = require('../../config');
const modlog = require('../../handlers/modlog');

module.exports = {
    name: 'guildAuditLogEntryCreate',
    async execute(entry, guild) {
        const logChannel = guild.channels.cache.get(MOD_LOG_CHANNEL_ID);
        if (!logChannel) return;
        await modlog.handleEntry(entry, guild, logChannel);
    }
};