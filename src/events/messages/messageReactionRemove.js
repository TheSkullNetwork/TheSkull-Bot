const { updateSuggestionVotes } = require('../../handlers/suggestionReactions');

module.exports = {
    name: 'messageReactionRemove',
    async execute(reaction, user) {
        try {
            if (user.bot) return;
            if (reaction.partial) await reaction.fetch();
            await updateSuggestionVotes(reaction);
        } catch (err) {
            console.error('messageReactionRemove error:', err);
        }
    }
};
