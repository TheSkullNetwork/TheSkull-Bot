const config = require('../../config.json');
const { buildHelpPayload, buildErrorPayload, buildVoteRequiredPayload, checkVote, handleR34Command } = require('../../handlers/rule34');

module.exports = {
    name: 'r34',
    async execute(message, args) {
        if (message.channel.id !== config.R34_CHANNEL_ID) {
            return message.reply(buildErrorPayload(`This command can only be used in <#${config.R34_CHANNEL_ID}>.`));
        }

        if (!args || args.length === 0) {
            return message.reply(buildHelpPayload());
        }

        const rawLast = String(args[args.length - 1]).toLowerCase();
        let type = 'any';
        let query = args.join(' ');
        if (['image', 'images', 'img', 'picture'].includes(rawLast)) {
            type = 'images';
            query = args.slice(0, -1).join(' ');
        } else if (['video', 'videos', 'vid'].includes(rawLast)) {
            type = 'videos';
            query = args.slice(0, -1).join(' ');
        } else if (['random', 'any', 'mix'].includes(rawLast)) {
            type = 'any';
            query = args.slice(0, -1).join(' ');
        }

        const clientId = process.env.CLIENT_ID;
        const topGgToken = process.env.TOP_GG_TOKEN;
        if (clientId && topGgToken) {
            const voted = await checkVote(clientId, message.author.id, topGgToken);
            if (!voted) {
                return message.reply(buildVoteRequiredPayload(clientId));
            }
        }

        await handleR34Command(message, query, type);
    }
};