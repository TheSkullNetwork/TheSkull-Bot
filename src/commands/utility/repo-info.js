const { BOOK, ERROR, LINK, RELOAD, STAR, WARNING } = require('../../emojis');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repo-info')
        .setDescription('Get GitHub repo stats')
        .addStringOption(option => 
            option.setName('repo')
            .setDescription('e.g. theskullnetwork/example')
            .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply(); 

        const repo = interaction.options.getString('repo');

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
            await interaction.editReply({ embeds: [repoEmbed] });
        } catch (error) {
            await interaction.deleteReply();
            await interaction.followUp({ 
                content: `${ERROR} **Error:** Could not find that repository. Please ensure the format is \`owner/repo\` (e.g., \`theskullnetwork/example\`).`, 
                ephemeral: true 
            });
        }
    },
};