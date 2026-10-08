const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const config = require('../../config.json');
const { buildHelpPayload, buildErrorPayload, buildVoteRequiredPayload, checkVote, handleR34Command } = require('../../handlers/rule34');

function ephemeral(payload) {
    return {
        ...payload,
        flags: payload.flags | MessageFlags.Ephemeral
    };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rule34')
        .setDescription('Search Rule34 for anime/hentai content')
        .addStringOption(o =>
            o.setName('query')
                .setDescription('Search tags (e.g. "hatsune miku", "ass", "hentai")')
        )
        .addStringOption(o =>
            o.setName('type')
                .setDescription('Content type to return')
                .addChoices(
                    { name: 'Random (default)', value: 'any' },
                    { name: 'Videos only', value: 'videos' },
                    { name: 'Images only', value: 'images' }
                )
        ),

    async execute(interaction) {
        if (interaction.channel.id !== config.R34_CHANNEL_ID) {
            return interaction.reply(ephemeral(buildErrorPayload(`This command can only be used in <#${config.R34_CHANNEL_ID}>.`)));
        }

        const query = interaction.options.getString('query');
        const type = interaction.options.getString('type') || 'any';

        if (!query) {
            return interaction.reply(ephemeral(buildHelpPayload()));
        }

        const clientId = process.env.CLIENT_ID;
        const topGgToken = process.env.TOP_GG_TOKEN;

        if (clientId && topGgToken) {
            const voted = await checkVote(interaction.user.id);
            if (!voted) {
                return interaction.reply(ephemeral(await buildVoteRequiredPayload(clientId)));
            }
        }

        await handleR34Command(interaction, query, type);
    }
};