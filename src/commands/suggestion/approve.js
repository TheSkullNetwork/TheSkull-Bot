const { ERROR, SUCCESS } = require('../../emojis');
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { suggestions } = require('../../database/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('approve')
        .setDescription('Approve a suggestion')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(o => o.setName('id').setDescription('ID').setRequired(true))
        .addStringOption(o => o.setName('reason').setDescription('Reason')),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.editReply({ content: `${ERROR} Staff only` });
        }

        const id = interaction.options.getInteger('id');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const entry = suggestions.get(id);

        if (!entry) return interaction.editReply({ content: `${ERROR} ID not found.` });

        try {
            const channel = await interaction.client.channels.fetch(entry.channel_id);
            const message = await channel.messages.fetch(entry.msg_id);

            const newEmbed = EmbedBuilder.from(message.embeds[0])
                .addFields({ name: `${SUCCESS} Approved`, value: reason })
                .setColor(0x00FF00);

            await message.edit({ embeds: [newEmbed] });
            return interaction.editReply({ content: `Suggestion #${id} has been approved.` });
        } catch {
            return interaction.editReply({ content: `${ERROR} Could not edit message.` });
        }
    }
};