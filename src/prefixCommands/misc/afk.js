const { SLEEP } = require('../../emojis');
const { afk } = require('../../database/database.js');

function formatDuration(ms) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const parts = [];
    if (h) parts.push(`${h}h`);
    if (m) parts.push(`${m}m`);
    if (sec || !parts.length) parts.push(`${sec}s`);
    return parts.join(' ');
}

module.exports = {
    name: 'afk',
    description: 'Set yourself as AFK with an optional reason',
    execute(message, args) {
        const reason = args.join(' ') || 'No reason given';
        afk.set(message.author.id, reason);
        message.reply(`${SLEEP} You're now AFK: **${reason}**`);
    },
    formatDuration
};
