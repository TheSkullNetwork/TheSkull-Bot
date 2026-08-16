const { WARNING, SUCCESS } = require('../../emojis');
const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { suggestions } = require('../../database/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset-suggestions')
        .setDescription('Wipes all suggestions and resets the counter back to #1 (Admin only)')
        .addBooleanOption(o =>
            o.setName('confirm')
                .setDescription('Set to true to confirm — this cannot be undone')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const confirm = interaction.options.getBoolean('confirm');

        if (!confirm) {
            return interaction.reply({
                content: `${WARNING} Set \`confirm\` to \`true\` to actually wipe all suggestions. This cannot be undone.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        suggestions.resetAll();

        await interaction.reply({
            content: `${SUCCESS} All suggestions have been cleared and the counter has been reset.`,
        });
    },
};