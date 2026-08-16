const { ERROR, SUCCESS } = require('../../emojis');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { warnings } = require('../../database/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-warn')
        .setDescription('Remove a specific warning or clear all warnings')
        .addUserOption(o => o.setName('target').setDescription('The user to modify').setRequired(true))
        .addIntegerOption(o => o.setName('index').setDescription('The warning number to remove'))
        .addBooleanOption(o => o.setName('all').setDescription('Set to true to clear ALL warnings for this user'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const index = interaction.options.getInteger('index');
        const all = interaction.options.getBoolean('all');

        const userWarnings = warnings.get(target.id);
        if (!userWarnings.length) {
            return interaction.reply({ content: `${ERROR} ${target.username} has no warnings.`, ephemeral: true });
        }

        if (all) {
            warnings.clearAll(target.id);
            return interaction.reply({ content: `${SUCCESS} All warnings cleared for **${target.username}**.` });
        }

        if (!index) {
            return interaction.reply({ content: `${ERROR} Provide an \`index\` or set \`all\` to true.`, ephemeral: true });
        }

        const removed = warnings.remove(target.id, index);
        if (!removed) {
            return interaction.reply({ content: `${ERROR} Invalid warning number. Use /check-warn.`, ephemeral: true });
        }

        await interaction.reply({ content: `${SUCCESS} Removed warning #${index} from **${target.username}**: "${removed.reason}"` });
    }
};