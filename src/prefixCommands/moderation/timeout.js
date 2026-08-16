const { ERROR, HOURGLASS } = require('../../emojis');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'timeout',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply('You do not have permission to use this command.');
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Please mention a user to timeout.');
        }

        const minutesArg = args[1];
        const minutes = parseInt(minutesArg);
        if (!minutes || isNaN(minutes) || minutes <= 0) {
            return message.reply('Please provide a valid number of minutes for the timeout.');
        }

        const reason = args.slice(2).join(' ') || 'No reason provided';

        if (target.id === message.client.user.id) {
            return message.reply('I cannot timeout myself!');
        }
        if (target.id === message.guild.ownerId) {
            return message.reply('I cannot timeout the server owner.');
        }
        if (!target.moderatable) {
            return message.reply(`${ERROR} I cannot timeout this user.`);
        }

        try {
            await target.timeout(minutes * 60 * 1000, reason);

            const embed = new EmbedBuilder()
                .setTitle(`${HOURGLASS} User Timed Out`)
                .setColor(0xFFA500)
                .addFields(
                    { name: 'User', value: `<@${target.id}>`, inline: true },
                    { name: 'Moderator', value: `${message.author.tag}`, inline: true },
                    { name: 'Duration', value: `${minutes} minutes`, inline: true },
                    { name: 'Reason', value: reason }
                );

            try {
                await target.send({ 
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('You have been timed out')
                            .setColor(0xFFA500)
                            .setDescription(`Reason: ${reason}\nDuration: ${minutes}m\nBy: ${message.author.tag}`)
                    ] 
                });
            } catch (e) {  }

            await message.channel.send({ content: `<@${target.id}>`, embeds: [embed] });
        } catch (error) {
            await message.reply(`${ERROR} There was an error trying to timeout this user.`);
        }
    },
};
