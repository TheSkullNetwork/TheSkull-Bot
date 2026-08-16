const { SPARKLES, SUCCESS, THUMBS_UP, THUMBS_DOWN, SHRUG, ERROR } = require('../../emojis');
const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { suggestions } = require('../../database/database.js');
const { SUGGESTIONS_CHANNEL_ID } = require('../../config');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Submit a suggestion')
        .addStringOption(o => o.setName('text').setDescription('The suggestion').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const targetChannelId = SUGGESTIONS_CHANNEL_ID;
        if (!targetChannelId) return interaction.editReply({ content: `${ERROR} Admin has not set the channel!` });
        const count = suggestions.getNextCount();
        const channel = await interaction.client.channels.fetch(targetChannelId);

        const embed = new EmbedBuilder()
            .setTitle(`${SPARKLES} Suggestion #${count}`)
            .setDescription(interaction.options.getString('text'))
            .setColor(0xFFFF00)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setFooter({ text: `Suggestion ID: ${count}` });
        const msg = await channel.send({ embeds: [embed] });
        await msg.react(THUMBS_UP);
        await msg.react(THUMBS_DOWN);
        await msg.react(SHRUG);
        suggestions.add(msg.id, targetChannelId, count);
        return interaction.editReply({ content: `${SUCCESS} Suggestion #${count} sent!` });
    }
};