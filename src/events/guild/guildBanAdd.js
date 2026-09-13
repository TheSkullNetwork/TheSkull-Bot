const { clearUserData } = require('../../handlers/memberCleanup');
const { EmbedBuilder } = require('discord.js');
const { BAN } = require('../../emojis');

module.exports = {
    name: 'guildBanAdd',
    async execute(ban) {
        try {
            const reason = ban.reason || 'No reason provided';
            try {
                await ban.user.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`${BAN} You were banned`)
                            .setColor(0xFF0000)
                            .setDescription(`You were banned from **${ban.guild.name}**.`)
                            .addFields({ name: 'Reason', value: reason, inline: false })
                            .setTimestamp()
                    ]
                });
            } catch (e) {}

            clearUserData(ban.user.id, ban.user.tag);
        } catch (err) {
            console.error('Failed to clean up member data on ban:', err);
        }
    }
};