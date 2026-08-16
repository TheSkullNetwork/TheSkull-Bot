const { CHART, CLOCK, RELOAD, SUCCESS } = require('../../emojis');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot\'s latency and connection status'),

    async execute(interaction) {
        const sent = await interaction.reply({ content: `${RELOAD} Calculating ping...`, fetchReply: true });
        
        const roundtripLatency = sent.createdTimestamp - interaction.createdTimestamp;
        const websocketPing = Math.round(interaction.client.ws.ping);

        const embed = new EmbedBuilder()
            .setTitle(`${SUCCESS} Pong!`)
            .setColor(0x00FF00)
            .addFields(
                { name: `${CLOCK} Roundtrip Latency`, value: `\`${roundtripLatency}ms\``, inline: true },
                { name: `${CHART} WebSocket Heartbeat`, value: `\`${websocketPing}ms\``, inline: true }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        await interaction.editReply({ content: null, embeds: [embed] });
    }
};
