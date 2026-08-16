const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'avatar',
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        const avatarURL = user.displayAvatarURL({ size: 4096, dynamic: true });

        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Avatar`)
            .setColor(0x0099FF)
            .setImage(avatarURL);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('View Full Size')
                    .setStyle(ButtonStyle.Link)
                    .setURL(avatarURL)
            );

        await message.reply({ embeds: [embed], components: [row] });
    }
};

