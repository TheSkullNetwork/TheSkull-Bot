const skullboard = require('../../handlers/skullboard.js');

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        if (user.bot) return;
        if (reaction.partial) await reaction.fetch();
        await skullboard.handleReaction(reaction);
    }
};
