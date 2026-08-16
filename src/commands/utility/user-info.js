const { INFO } = require('../../emojis');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Shows detailed information about a user')
        .addUserOption(option => 
            option.setName('target')
            .setDescription('The user to check')),

    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);
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
        await interaction.reply({ embeds: [embed] });
    },
};

