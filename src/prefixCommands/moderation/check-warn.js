const { ERROR } = require('../../emojis');
const { EmbedBuilder } = require('discord.js');
const { warnings } = require('../../database/database.js');

module.exports = {
    name: 'check-warn',
    async execute(message, args) {
        const target = message.mentions.users.first() || message.author;
        const userWarnings = warnings.get(target.id);

        if (!userWarnings || !userWarnings.length) {
            return message.reply(`${ERROR} **${target.username}** has no warnings.`);
        }

        const embed = new EmbedBuilder()
            .setTitle(`Warnings for ${target.username}`)
            .setColor(0xFFCC00)
            .setDescription(userWarnings.map((w, i) =>
                `**${i + 1}.** ${w.reason}\n   + *Date: ${w.date} | By: ${w.moderator}*`
            ).join('\n\n'))
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }
};
