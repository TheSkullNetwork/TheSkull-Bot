const { EmbedBuilder } = require('discord.js');
const { suggestions } = require('../database/database.js');
const { THUMBS_UP, THUMBS_DOWN, SHRUG } = require('../emojis.json');

async function updateSuggestionVotes(reaction) {
    const entry = suggestions.getByMsgId(reaction.message.id);
    if (!entry) return;

    try {
        const channel = await reaction.client.channels.fetch(entry.channel_id);
        const msg = await channel.messages.fetch(entry.msg_id);
        if (!msg.embeds || !msg.embeds.length) return;

        const embed = msg.embeds[0];
        const embedJson = embed.toJSON ? embed.toJSON() : embed;

        const countFor = (emoji) => {
            const react = msg.reactions.cache.get(emoji);
            const n = react ? react.count : 0;
            return Math.max(0, n - 1);
        };

        const votesText = `${THUMBS_UP} ${countFor(THUMBS_UP)}  ${THUMBS_DOWN} ${countFor(THUMBS_DOWN)}  ${SHRUG} ${countFor(SHRUG)}`;

        if (embedJson.fields && embedJson.fields.length) {
            const fields = [...embedJson.fields];
            const idx = fields.findIndex(f => f.name && f.name.includes('Votes'));
            if (idx !== -1) {
                fields[idx] = { name: fields[idx].name, value: votesText, inline: true };
                await msg.edit({
                    embeds: [new EmbedBuilder(embedJson).setFields(fields)]
                });
            }
        }
    } catch (err) {
        console.error('Suggestion vote update error:', err);
    }
}

module.exports = { updateSuggestionVotes };
