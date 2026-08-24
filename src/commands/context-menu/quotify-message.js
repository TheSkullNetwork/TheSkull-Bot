const { ContextMenuCommandBuilder, ApplicationCommandType, AttachmentBuilder } = require('discord.js');
const { generateQuoteImage, containsCustomEmoji, resolveQuoteAuthor } = require('../../handlers/quoteCard');
const { ERROR } = require('../../emojis');

const MAX_LENGTH = 300;

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Quotify')
        .setType(ApplicationCommandType.Message),

    async execute(interaction) {
        const message = interaction.targetMessage;
        const text = (message.content || '').trim();

        if (!text) {
            return interaction.reply({
                content: `${ERROR} That message has no text to quotify.`,
                ephemeral: true
            });
        }

        if (containsCustomEmoji(text)) {
            return interaction.reply({
                content: `${ERROR} Custom emojis aren't supported in quote images \u2014 try again without them.`,
                ephemeral: true
            });
        }

        await interaction.deferReply();

        const trimmed = text.length > MAX_LENGTH ? `${text.slice(0, MAX_LENGTH - 1)}\u2026` : text;
        const { displayName, avatarURL } = await resolveQuoteAuthor(interaction, message.author);

        const buffer = await generateQuoteImage({ avatarURL, displayName, text: trimmed });
        const attachment = new AttachmentBuilder(buffer, { name: 'quote.png' });

        await interaction.editReply({ files: [attachment] });
    }
};