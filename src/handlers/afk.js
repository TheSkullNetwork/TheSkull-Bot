const { SLEEP } = require('../emojis');
const { afk } = require('../database/database.js');
const { formatDuration } = require('../prefixCommands/misc/afk.js');

async function checkReturn(message, isAfkCommand) {
    const userAfk = afk.get(message.author.id);
    if (isAfkCommand || !userAfk) return;

    const duration = formatDuration(Date.now() - userAfk.since);
    afk.remove(message.author.id);
    await message.reply(`${SLEEP} Welcome back! You were AFK for **${duration}** (${userAfk.pings} ping${userAfk.pings === 1 ? '' : 's'} while away).\n*Reason was: ${userAfk.reason}*`);
}

async function notifyMentions(message) {
    for (const [userId, mentionedUser] of message.mentions.users) {
        if (userId === message.author.id) continue;
        const mentionedAfk = afk.get(userId);
        if (!mentionedAfk) continue;

        afk.incrementPings(userId);
        const duration = formatDuration(Date.now() - mentionedAfk.since);
        const displayName = message.guild?.members.cache.get(userId)?.displayName || mentionedUser.username;
        const notice = await message.reply(`${SLEEP} **${displayName}** is AFK: **${mentionedAfk.reason}** \u2014 away for ${duration}`);
        setTimeout(() => notice.delete().catch(() => {}), 4000);
    }
}

module.exports = { checkReturn, notifyMentions };
