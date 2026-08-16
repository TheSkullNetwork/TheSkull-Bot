const { SUCCESS } = require('../../emojis');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Deletes messages (Admin only)')
        .addIntegerOption(option => option.setName('amount').setDescription('Number of messages').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        if (amount < 1 || amount > 100) return interaction.reply({ content: 'Enter 1-100.', ephemeral: true });

        await interaction.channel.bulkDelete(amount, true);
        await interaction.reply({ content: `${SUCCESS} Deleted ${amount} messages.`, ephemeral: true });
    },
};

