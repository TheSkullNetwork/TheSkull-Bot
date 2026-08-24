const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { generateQuoteImage, containsCustomEmoji, resolveQuoteAuthor } = require('../../handlers/quoteCard');
const { ERROR } = require('../../emojis');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quotify')
        .setDescription('Turn text into a quote image')
        .addStringOption(o =>
            o.setName('text')
                .setDescription('The quote text')
                .setRequired(true)
                .setMaxLength(300))
        .addUserOption(o =>
            o.setName('author')
                .setDescription('Who the quote is attributed to (defaults to you)')),

    async execute(interaction) {
        const text = interaction.options.getString('text', true);
        const author = interaction.options.getUser('author') || interaction.user;

        if (containsCustomEmoji(text)) {
            return interaction.reply({
                content: `${ERROR} Custom emojis aren't supported in quote images \u2014 try again without them.`,
                ephemeral: true
            });
        }

        await interaction.deferReply();

        const { displayName, avatarURL } = await resolveQuoteAuthor(interaction, author);

        const buffer = await generateQuoteImage({ avatarURL, displayName, text });
        const attachment = new AttachmentBuilder(buffer, { name: 'quote.png' });

        await interaction.editReply({ files: [attachment] });
    }
};