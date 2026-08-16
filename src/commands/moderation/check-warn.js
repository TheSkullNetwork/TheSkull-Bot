const { ERROR } = require('../../emojis');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { warnings } = require('../../database/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check-warn')
        .setDescription('Check all warnings for a specific user')
        .addUserOption(option =>
            option.setName('target').setDescription('The user to check warnings for').setRequired(true)),

    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const userWarnings = warnings.get(target.id);

        if (!userWarnings.length) {
            return interaction.reply({
                content: `${ERROR} **${target.username}** has no warnings.`,
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle(`Warnings for ${target.username}`)
            .setColor(0xFFCC00)
            .setDescription(userWarnings.map((w, i) =>
                `**${i + 1}.** ${w.reason}\n   + *Date: ${w.date} | By: ${w.moderator}*`
            ).join('\n\n'))
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
