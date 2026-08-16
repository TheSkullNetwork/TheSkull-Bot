const { ROLE_BADGES } = require('../config');
const { profiles } = require('../database/database.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function ensureProfile(userId) {
    profiles.ensure(userId);
}

function getBadges(member) {
    const badges = [];
    for (const [roleId, badge] of Object.entries(ROLE_BADGES || {})) {
        if (member.roles.cache.has(roleId)) badges.push(badge);
    }
    return badges;
}

function buildProfileButtons(member) {
    const data = profiles.get(member.id);
    const buttons = [];

    if (data.github) {
        buttons.push(new ButtonBuilder().setLabel('GitHub').setStyle(ButtonStyle.Link).setURL(data.github));
    }
    if (data.portfolio) {
        buttons.push(new ButtonBuilder().setLabel('Portfolio').setStyle(ButtonStyle.Link).setURL(data.portfolio));
    }

    if (!buttons.length) return null;
    return new ActionRowBuilder().addComponents(buttons);
}

module.exports = { ensureProfile, getBadges, buildProfileButtons };