const { BOOK, ERROR, LINK, RELOAD, STAR, WARNING } = require('../../emojis');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'repoinfo',
    async execute(message, args) {
        const repo = args[0];
        if (!repo) {
            return message.reply(`${ERROR} Usage: \`x!repoinfo <owner/repo>\` (e.g. \`x!repoinfo discordjs/discord.js\`)`);
        }

        try {
            const { data } = await axios.get(`https://api.github.com/repos/${repo}`);

            const repoEmbed = new EmbedBuilder()
                .setColor(0x2ea043)
                .setTitle(`${LINK} ${data.full_name}`)
                .setURL(data.html_url)
                .setDescription(data.description || 'No description provided.')
                .addFields(
                    { name: `${STAR} Stars`, value: data.stargazers_count.toLocaleString(), inline: true },
                    { name: `${RELOAD} Forks`, value: data.forks_count.toLocaleString(), inline: true },
                    { name: `${WARNING} Issues`, value: data.open_issues_count.toLocaleString(), inline: true },
                    { name: `${BOOK} Language`, value: data.language || 'N/A', inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'GitHub API \u2014 TheSkull', iconURL: data.owner.avatar_url });

            await message.reply({ embeds: [repoEmbed] });
        } catch (error) {
            message.reply(`${ERROR} **Error:** Could not find that repository. Please ensure the format is \`owner/repo\` (e.g., \`theskullnetwork/theskullbot\`).`);
        }
    }
};