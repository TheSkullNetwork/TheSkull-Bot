const { MEMBER_ROLE_ID } = require('../../config');
const { ensureProfile } = require('../../handlers/profile');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        try {
            const role = member.guild.roles.cache.get(MEMBER_ROLE_ID);
            if (role) {
                await member.roles.add(role);
                console.log(`Assigned member role to ${member.user.tag}`);
            }
        } catch (err) {
            console.error('Failed to add auto-role:', err);
        }

        try {
            ensureProfile(member.id);
        } catch (err) {
            console.error('Failed to create blank profile:', err);
        }
    }
};