const { ERROR, HOURGLASS } = require('../../emojis');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user and notify them')
        .addUserOption(o => o.setName('target').setDescription('User to timeout').setRequired(true))
        .addIntegerOption(o => o.setName('minutes').setDescription('Duration in minutes (1 min - 28 days)').setRequired(true).setMinValue(1).setMaxValue(40320))
        .addStringOption(o => o.setName('reason').setDescription('Reason for timeout'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const minutes = interaction.options.getInteger('minutes');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!target) {
            return interaction.reply({ content: `${ERROR} That user is not in this server.`, ephemeral: true });
        }
        if (target.id === interaction.client.user.id) {
            return interaction.reply({ content: 'I cannot timeout myself!', ephemeral: true });
        }
        if (target.id === interaction.guild.ownerId) {
            return interaction.reply({ content: 'I cannot timeout the server owner.', ephemeral: true });
        }
        if (!target.moderatable) {
            return interaction.reply({ content: `${ERROR} I cannot timeout this user.`, ephemeral: true });
        }

        await interaction.deferReply();

        try {
            await target.timeout(minutes * 60 * 1000, reason);
        } catch (err) {
            console.error('Timeout failed:', err);
            return interaction.editReply({ content: `${ERROR} Discord rejected the timeout. Check my role position and permissions.` });
        }

        try {
            await target.send({ embeds: [new EmbedBuilder().setTitle('You have been timed out').setColor(0xFFA500).setDescription(`Reason: ${reason}\nDuration: ${minutes}m\nBy: ${interaction.user.tag}`)] });
        } catch (e) {}

        const embed = new EmbedBuilder()
            .setTitle(`${HOURGLASS} User Timed Out`)
            .setColor(0xFFA500)
            .addFields(
                { name: 'User', value: `<@${target.id}>`, inline: true },
                { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                { name: 'Duration', value: `${minutes} minutes`, inline: true },
                { name: 'Reason', value: reason }
            );
        await interaction.editReply({ content: `<@${target.id}>`, embeds: [embed] });
    },
};
