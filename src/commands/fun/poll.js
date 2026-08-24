const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const NUMBER_EMOJIS = ['1\u20e3', '2\u20e3', '3\u20e3', '4\u20e3', '5\u20e3'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Start an interactive live-tracked poll')
        .addStringOption(o =>
            o.setName('question')
                .setDescription('The poll question')
                .setRequired(true)
                .setMaxLength(200))
        .addStringOption(o =>
            o.setName('option1')
                .setDescription('First option')
                .setRequired(true)
                .setMaxLength(80))
        .addStringOption(o =>
            o.setName('option2')
                .setDescription('Second option')
                .setRequired(true)
                .setMaxLength(80))
        .addStringOption(o =>
            o.setName('option3')
                .setDescription('Third option')
                .setRequired(false)
                .setMaxLength(80))
        .addStringOption(o =>
            o.setName('option4')
                .setDescription('Fourth option')
                .setRequired(false)
                .setMaxLength(80))
        .addStringOption(o =>
            o.setName('option5')
                .setDescription('Fifth option')
                .setRequired(false)
                .setMaxLength(80)),

    async execute(interaction) {
        const question = interaction.options.getString('question', true);
        const options = [];
        
        for (let i = 1; i <= 5; i++) {
            const val = interaction.options.getString(`option${i}`);
            if (val) options.push(val);
        }

        const votes = new Map();
        options.forEach((_, i) => votes.set(i, new Set()));

        const getEmbed = () => {
            const totalVotes = Array.from(votes.values()).reduce((acc, set) => acc + set.size, 0);
            
            const description = options.map((opt, i) => {
                const count = votes.get(i).size;
                const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                const barLength = Math.round(percentage / 10);
                const bar = '█'.repeat(barLength) + '░'.repeat(10 - barLength);
                return `${NUMBER_EMOJIS[i]} **${opt}**\n\`${bar}\` ${count} votes (${percentage}%)`;
            }).join('\n\n');

            return new EmbedBuilder()
                .setTitle(`\ud83d\udcca Live Poll: ${question}`)
                .setDescription(description)
                .setColor('#5865F2')
                .setFooter({ text: `Total Votes: ${totalVotes} • Created by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();
        };

        const getRow = (disabled = false) => {
            const row = new ActionRowBuilder();
            options.forEach((_, i) => {
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`poll_${i}`)
                        .setLabel(`${i + 1} (${votes.get(i).size})`)
                        .setEmoji(NUMBER_EMOJIS[i])
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(disabled)
                );
            });
            return row;
        };

        await interaction.reply({ embeds: [getEmbed()], components: [getRow()] });
        const message = await interaction.fetchReply();

        const collector = message.createMessageComponentCollector({ time: 86400000 });

        collector.on('collect', async i => {
            const optIndex = parseInt(i.customId.split('_')[1]);
            const userId = i.user.id;

            for (const [idx, userSet] of votes.entries()) {
                if (userSet.has(userId)) {
                    userSet.delete(userId);
                }
            }

            votes.get(optIndex).add(userId);

            await i.update({ embeds: [getEmbed()], components: [getRow()] });
        });

        collector.on('end', async () => {
            try {
                await message.edit({ components: [getRow(true)] });
            } catch (err) {}
        });
    }
};