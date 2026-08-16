const { clearUserData } = require('../../handlers/memberCleanup');

module.exports = {
    name: 'guildBanAdd',
    async execute(ban) {
        try {
            clearUserData(ban.user.id, ban.user.tag);
        } catch (err) {
            console.error('Failed to clean up member data on ban:', err);
        }
    }
};