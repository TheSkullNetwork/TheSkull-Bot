const { ERROR, HOURGLASS } = require('../../emojis');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user and notify them')
        .addUserOption(o => o.setName('target').setDescription('User to timeout').setRequired(true))
        .addIntegerOption(o => o.setName('minutes').setDescription('Duration in minutes').setRequired(true))
        .addStringOption(o => o.setName('reason').setDescription('Reason for timeout'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        await interaction.deferReply();

        const target = interaction.options.getMember('target');
        const minutes = interaction.options.getInteger('minutes');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        if (target.id === interaction.client.user.id) return interaction.reply({ content: 'I cannot timeout myself!', ephemeral: true });
        if (target.id === interaction.guild.ownerId) return interaction.reply({ content: 'I cannot timeout the server owner.', ephemeral: true });
        if (!target.moderatable) {
            return interaction.editReply({ content: `${ERROR} I cannot timeout this user.`, ephemeral: true });
        }

        await target.timeout(minutes * 60 * 1000, reason);

        const embed = new EmbedBuilder()
            .setTitle(`${HOURGLASS} User Timed Out`)
            .setColor(0xFFA500)
            .addFields(
                { name: 'User', value: `<@${target.id}>`, inline: true },
                { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                { name: 'Duration', value: `${minutes} minutes`, inline: true },
                { name: 'Reason', value: reason }
            );
        try {
            await target.send({ embeds: [new EmbedBuilder().setTitle('You have been timed out').setColor(0xFFA500).setDescription(`Reason: ${reason}\nDuration: ${minutes}m\nBy: ${interaction.user.tag}`)] });
        } catch (e) {  }

        await interaction.editReply({ content: `<@${target.id}>`, embeds: [embed] });
    },
};