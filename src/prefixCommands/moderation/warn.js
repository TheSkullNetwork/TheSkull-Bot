const { BOOK, CALENDAR, ERROR, INFO, SEARCH, SHIELD, SUCCESS, WARNING } = require('../../emojis');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { warnings } = require('../../database/database.js');

module.exports = {
    name: 'warn',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply('You do not have permission to use this command.');
        }

        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('Please mention a user to warn.');
        }

        const reason = args.slice(1).join(' ');
        if (!reason) {
            return message.reply('Please provide a reason for the warning.');
        }

        const date = new Date().toLocaleDateString();

        warnings.add(target.id, reason, message.author.username, date);

        let dmStatus = `${SUCCESS} Delivered Successfully`;
        try {
            const dmEmbed = new EmbedBuilder()
                .setTitle(`${WARNING} Official Warning Issued`)
                .setColor('#FF3333')
                .setDescription(`You have received a formal warning in **${message.guild.name}**. Please review our community guidelines to ensure future compliance.`)
                .addFields(
                    { name: `${BOOK} Reason`, value: `> ${reason}`, inline: false },
                    { name: `${SHIELD} Moderator`, value: `\`${message.author.tag}\``, inline: true },
                    { name: `${CALENDAR} Date Issued`, value: `\`${date}\``, inline: true }
                )
                .setFooter({ text: 'Automated Moderation System', iconURL: message.guild.iconURL() })
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
                { name: `${SHIELD} Moderator`, value: `<@${message.author.id}> \`(${message.author.tag})\``, inline: false },
                { name: `${BOOK} Reason`, value: `> ${reason}`, inline: false },
                { name: `${INFO} Notification Status`, value: `\`${dmStatus}\``, inline: false }
            )
            .setFooter({ text: `User ID: ${target.id} \u2014 Action ID logged`, iconURL: message.client.user.displayAvatarURL() })
            .setTimestamp();

        await message.channel.send({ content: `<@${target.id}>`, embeds: [embed] });
    }
};
