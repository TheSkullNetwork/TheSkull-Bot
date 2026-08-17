const { warnings, afk, profiles } = require('../database/database.js');

function clearUserData(userId, tag) {
    warnings.clearAll(userId);
    afk.remove(userId);
    profiles.remove(userId);
    console.log(`Cleared stored data for ${tag || userId}`);
}

module.exports = { clearUserData };
