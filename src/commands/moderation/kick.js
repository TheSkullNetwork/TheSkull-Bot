const { ERROR, WARNING } = require('../../emojis');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user and notify them')
        .addUserOption(o => o.setName('target').setDescription('User to kick').setRequired(true))
        .addStringOption(o => o.setName('reason').setDescription('Reason for kick'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!target) {
            return interaction.reply({ content: `${ERROR} That user isn't in this server.`, ephemeral: true });
        }
        if (target.id === interaction.guild.ownerId || (target.roles.highest >= interaction.member.roles.highest && interaction.guild.ownerId !== interaction.user.id)) {
            return interaction.reply({ content: `${ERROR} You can't kick someone with an equal or higher role.`, ephemeral: true });
        }
        if (!target.kickable) return interaction.reply({ content: `${ERROR} I can't kick this user.`, ephemeral: true });

        await interaction.deferReply();
        try {
            await target.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${WARNING} You were kicked`)
                        .setColor(0xFF0000)
                        .setDescription(`You were kicked from **${interaction.guild.name}**.`)
                        .addFields(
                            { name: 'Reason', value: reason, inline: false },
                            { name: 'Moderator', value: interaction.user.tag, inline: true }
                        )
                        .setTimestamp()
                ]
            });
        } catch (e) {}

        try {
            await target.kick(reason);
        } catch (err) {
            console.error('Kick failed:', err);
            return interaction.editReply({ content: `${ERROR} Kick failed. Check my role position and permissions.` });
        }

        const embed = new EmbedBuilder()
            .setTitle(`${WARNING} User Kicked`)
            .setColor(0xFF0000)
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`**${target.user.tag}** was kicked from ${interaction.guild.name}.`)
            .addFields(
                { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true },
                { name: 'Reason', value: reason, inline: false }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};