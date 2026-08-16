const { ERROR, WARNING } = require('../../emojis');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'kick',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return message.reply('You do not have permission to use this command.');
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Please mention a user to kick.');
        }

        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (target.id === message.client.user.id) {
            return message.reply('I cannot kick myself!');
        }
        if (target.id === message.guild.ownerId) {
            return message.reply('I cannot kick the server owner.');
        }
        if (!target.kickable) {
            return message.reply(`${ERROR} I cannot kick this user.`);
        }

        try {
            const dmEmbed = new EmbedBuilder()
                .setTitle(`${WARNING} You have been kicked`)
                .setColor('#FF0000')
                .setDescription(`You were kicked from **${message.guild.name}**.`)
                .addFields(
                    { name: 'Reason', value: reason, inline: false },
                    { name: 'Moderator', value: message.author.tag, inline: true }
                )
                .setTimestamp();

            try {
                await target.send({ embeds: [dmEmbed] });
            } catch (e) {
                
            }

            await target.kick(reason);

            const embed = new EmbedBuilder()
                .setTitle(`${WARNING} User Kicked`)
                .setColor('#FF0000')
                .addFields(
                    { name: 'User', value: `<@${target.id}>`, inline: true },
                    { name: 'Moderator', value: message.author.tag, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await message.reply(`${ERROR} There was an error trying to kick this user.`);
        }
    }
};
