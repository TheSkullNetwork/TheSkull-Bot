const { SUCCESS, ERROR, WARNING, BOOK, SHIELD, CALENDAR, SEARCH, INFO } = require('../../emojis');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { warnings } = require('../../database/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user and notify them via DM')
        .addUserOption(option =>
            option.setName('target').setDescription('The user you want to warn').setRequired(true))
        .addStringOption(option =>
            option.setName('reason').setDescription('The reason for the warning').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        await interaction.deferReply();

        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');
        const date = new Date().toLocaleDateString();

        warnings.add(target.id, reason, interaction.user.username, date);

        let dmStatus = `${SUCCESS} Delivered Successfully`;
        try {
            const dmEmbed = new EmbedBuilder()
                .setTitle(`${WARNING} Official Warning Issued`)
                .setColor('#FF3333')
                .setDescription(`You have received a formal warning in **${interaction.guild.name}**. Please review our community guidelines to ensure future compliance.`)
                .addFields(
                    { name: `${BOOK} Reason`, value: `> ${reason}`, inline: false },
                    { name: `${SHIELD} Moderator`, value: `\`${interaction.user.tag}\``, inline: true },
                    { name: `${CALENDAR} Date Issued`, value: `\`${date}\``, inline: true }
                )
                .setFooter({ text: 'Automated Moderation System', iconURL: interaction.guild.iconURL() })
                .setTimestamp();
            await target.send({ embeds: [dmEmbed] });
        } catch {
            dmStatus = `${ERROR} Failed (DMs Closed / Blocked)`;
        }

        const embed = new EmbedBuilder()
            .setTitle(`${WARNING} Moderation Action: Warning Issued`)
            .setColor('#FF3333')
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: `${SEARCH} Target User`, value: `<@${target.id}> \`(${target.tag})\``, inline: false },
                { name: `${SHIELD} Moderator`, value: `<@${interaction.user.id}> \`(${interaction.user.tag})\``, inline: false },
                { name: `${BOOK} Reason`, value: `> ${reason}`, inline: false },
                { name: `${INFO} Notification Status`, value: `\`${dmStatus}\``, inline: false }
            )
            .setFooter({ text: `User ID: ${target.id} \u2014 Action ID logged`, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.deleteReply();
        await interaction.channel.send({ content: `<@${target.id}>`, embeds: [embed] });
    }
};