const skullboard = require('../../handlers/skullboard.js');

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        try {
            if (user.bot) return;
            if (reaction.partial) await reaction.fetch();
            await skullboard.handleReaction(reaction);
        } catch (err) {
            console.error('messageReactionAdd error:', err);
        }
    }
};
