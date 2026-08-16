const { SKULL } = require('../emojis');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { SKULLBOARD_CHANNEL_ID, SKULLBOARD_THRESHOLD } = require('../config');

module.exports = {
    async handleReaction(reaction) {
        if (reaction.emoji.name !== SKULL) return;
        await reaction.fetch();
        await reaction.message.fetch();
        if (reaction.count < SKULLBOARD_THRESHOLD) return;
        const channel = reaction.message.guild.channels.cache.get(SKULLBOARD_CHANNEL_ID);
        if (!channel) return;
        const existing = await channel.messages.fetch({ limit: 100 });
        const alreadyPosted = existing.some(m =>
            m.embeds[0]?.footer?.text?.includes(reaction.message.id)
        );
        if (alreadyPosted) return;
        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setAuthor({
                name: reaction.message.author.tag,
                iconURL: reaction.message.author.displayAvatarURL()
            })
            .setDescription(reaction.message.content || '*(No text content)*')
            .addFields(
                { name: 'Author', value: `<@${reaction.message.author.id}>`, inline: true },
                { name: 'Channel', value: `<#${reaction.message.channel.id}>`, inline: true }
            )
            .setFooter({ text: `msg:${reaction.message.id}` })
            .setTimestamp();
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Jump to Message')
                .setStyle(ButtonStyle.Link)
                .setURL(reaction.message.url)
        );
        const skullboardMessage = await channel.send({ embeds: [embed], components: [row] });
        await skullboardMessage.react(SKULL);
    }
};
