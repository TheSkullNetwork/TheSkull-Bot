const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const { WARNING, BAN, HOURGLASS, SEARCH, SHIELD, BOOK, CLOCK } = require('../emojis');

function baseEmbed(guild) {
    return new EmbedBuilder()
        .setTimestamp()
        .setFooter({ text: '\u200B', iconURL: guild.iconURL() });
}

async function logKick(entry, guild, logChannel) {
    const embed = baseEmbed(guild)
        .setTitle(`${WARNING} Member Kicked`)
        .setColor(0xFFA500)
        .addFields(
            { name: `${SEARCH} Target User`, value: `<@${entry.targetId}>`, inline: true },
            { name: `${SHIELD} Moderator`, value: `<@${entry.executorId}>`, inline: true },
            { name: `${BOOK} Reason`, value: `> ${entry.reason || 'No reason provided'}` }
        );
    await logChannel.send({ embeds: [embed] });
}

async function logBan(entry, guild, logChannel) {
    const embed = baseEmbed(guild)
        .setTitle(`${BAN} Member Banned`)
        .setColor(0xFF0000)
        .addFields(
            { name: `${SEARCH} Target User`, value: `<@${entry.targetId}>`, inline: true },
            { name: `${SHIELD} Moderator`, value: `<@${entry.executorId}>`, inline: true },
            { name: `${BOOK} Reason`, value: `> ${entry.reason || 'No reason provided'}` }
        );
    await logChannel.send({ embeds: [embed] });
}

async function logTimeout(entry, guild, logChannel) {
    const timeout = entry.changes.find(c => c.key === 'communication_disabled_until');
    if (!timeout || !timeout.new) return;

    const embed = baseEmbed(guild)
        .setTitle(`${HOURGLASS} Member Timed Out`)
        .setColor(0xFFCC00)
        .addFields(
            { name: `${SEARCH} Target User`, value: `<@${entry.targetId}>`, inline: true },
            { name: `${SHIELD} Moderator`, value: `<@${entry.executorId}>`, inline: true },
            { name: `${CLOCK} Timeout Until`, value: `<t:${Math.floor(new Date(timeout.new).getTime() / 1000)}:F>`, inline: true },
            { name: `${BOOK} Reason`, value: `> ${entry.reason || 'No reason provided'}` }
        );
    await logChannel.send({ embeds: [embed] });
}

async function handleEntry(entry, guild, logChannel) {
    if (entry.action === AuditLogEvent.MemberKick) {
        await logKick(entry, guild, logChannel);
    } else if (entry.action === AuditLogEvent.MemberBanAdd) {
        await logBan(entry, guild, logChannel);
    } else if (entry.action === AuditLogEvent.MemberUpdate) {
        await logTimeout(entry, guild, logChannel);
    }
}

module.exports = { handleEntry };