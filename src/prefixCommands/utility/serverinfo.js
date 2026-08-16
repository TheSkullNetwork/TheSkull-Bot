const { INFO } = require('../../emojis');
const { EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    name: 'serverinfo',
    async execute(message, args) {
        const { guild } = message;

        const textChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
        const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${INFO} Server Info: ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: 'Server Name', value: guild.name, inline: true },
                { name: 'Server ID', value: guild.id, inline: true },
                { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },

                { name: 'Members', value: `${guild.memberCount}`, inline: true },
                { name: 'Total Roles', value: `${guild.roles.cache.size}`, inline: true },
                { name: 'Boost Level', value: `Level ${guild.premiumTier} (${guild.premiumSubscriptionCount} boosts)`, inline: true },

                { name: 'Channels', value: `Text: ${textChannels} | Voice: ${voiceChannels}`, inline: true },
                { name: 'Created On', value: guild.createdAt.toDateString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'TheSkull' });

        await message.reply({ embeds: [embed] });
    }
};


