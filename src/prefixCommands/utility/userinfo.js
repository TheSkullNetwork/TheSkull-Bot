const { INFO } = require('../../emojis');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'userinfo',
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(user.id);

        const accountCreated = user.createdAt.toDateString();
        const joinedServer = member ? member.joinedAt.toDateString() : 'Not in server';

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${INFO} User Info: ${user.username}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Username', value: user.username, inline: true },
                { name: 'Display Name', value: user.globalName || 'None', inline: true },
                { name: 'Nickname', value: member?.nickname || 'None', inline: true },

                { name: 'User ID', value: user.id, inline: true },
                { name: 'Is Bot?', value: user.bot ? 'Yes' : 'No', inline: true },
                { name: 'Highest Role', value: member?.roles.highest.toString() || 'None', inline: true },

                { name: 'Account Created', value: accountCreated, inline: true },
                { name: 'Joined Server', value: joinedServer, inline: true }
            )
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }
};


