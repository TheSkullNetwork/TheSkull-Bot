const config = require('../../config.json');
const { buildErrorPayload, buildVoteRequiredPayload, checkVote, handleR34Command } = require('../../handlers/rule34');

module.exports = {
    name: 'ass',
    async execute(message) {
        if (message.channel.id !== config.R34_CHANNEL_ID) {
            return message.reply(buildErrorPayload(`This command can only be used in <#${config.R34_CHANNEL_ID}>.`));
        }
        const clientId = process.env.CLIENT_ID;
        const topGgToken = process.env.TOP_GG_TOKEN;
        if (clientId && topGgToken) {
            const voted = await checkVote(message.author.id);
            if (!voted) {
                return message.reply(await buildVoteRequiredPayload(clientId));
            }
        }
        await handleR34Command(message, 'ass', 'images');
    }
};
