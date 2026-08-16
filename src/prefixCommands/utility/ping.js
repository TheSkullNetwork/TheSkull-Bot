const { CHART, CLOCK, RELOAD, SUCCESS } = require('../../emojis');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    async execute(message, args) {
        const sent = await message.reply(`${RELOAD} Calculating ping...`);
        
        const roundtripLatency = sent.createdTimestamp - message.createdTimestamp;
        const websocketPing = Math.round(message.client.ws.ping);

        const embed = new EmbedBuilder()
            .setTitle(`${SUCCESS} Pong!`)
            .setColor(0x00FF00)
            .addFields(
                { name: `${CLOCK} Roundtrip Latency`, value: `\`${roundtripLatency}ms\``, inline: true },
                { name: `${CHART} WebSocket Heartbeat`, value: `\`${websocketPing}ms\``, inline: true }
            )
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        await sent.edit({ content: null, embeds: [embed] });
    }
};
