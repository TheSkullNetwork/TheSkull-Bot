const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get a user\'s profile picture')
        .addUserOption(option => 
            option.setName('target')
            .setDescription('The user to check')),

    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;
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
        
        await interaction.reply({ embeds: [embed], components: [row] });
    },
};

