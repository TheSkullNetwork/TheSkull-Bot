const { clearUserData } = require('../../handlers/memberCleanup');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        try {
            clearUserData(member.id, member.user.tag);
        } catch (err) {
            console.error('Failed to clean up member data on leave:', err);
        }
    }
};