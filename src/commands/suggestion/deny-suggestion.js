const { ERROR } = require('../../emojis');
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { suggestions } = require('../../database/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deny-suggestion')
        .setDescription('Deny a suggestion')
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

            const oldEmbed = message.embeds[0];
            const fields = oldEmbed.fields ? [...oldEmbed.fields] : [];
            const statusIdx = fields.findIndex(f => f.name && f.name.includes('Status'));
            if (statusIdx !== -1) {
                fields[statusIdx] = { name: fields[statusIdx].name, value: `${ERROR} \`Denied\``, inline: true };
            }
            fields.push({ name: `${ERROR} Denial Note`, value: reason });

            const newEmbed = EmbedBuilder.from(oldEmbed)
                .setFields(fields)
                .setColor(0xFF0000);

            await message.edit({ embeds: [newEmbed] });
            return interaction.editReply({ content: `Suggestion #${id} has been denied.` });
        } catch {
            return interaction.editReply({ content: `${ERROR} Could not edit message.` });
        }
    }
};