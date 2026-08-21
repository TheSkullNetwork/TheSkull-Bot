const { SUCCESS, ERROR, INFO } = require('../emojis');

function checkEnvVar(name, validator) {
    const value = process.env[name];
    if (!value) {
        console.log(`${ERROR} ${name} is missing from .env`);
        return false;
    }
    if (validator && !validator(value)) {
        console.log(`${ERROR} ${name} is present but looks malformed`);
        return false;
    }
    console.log(`${SUCCESS} ${name} found`);
    return true;
}

function runPreflightChecks() {
    console.log(`${INFO} Running startup checks...\n`);
    let ok = true;

    ok = checkEnvVar('TOKEN', v => v.split('.').length === 3) && ok;
    ok = checkEnvVar('CLIENT_ID', v => /^\d{17,20}$/.test(v)) && ok;

    let config;
    try {
        config = require('../config.json');
        console.log(`${SUCCESS} config.json loaded`);
    } catch (err) {
        console.log(`${ERROR} config.json failed to load: ${err.message}`);
        return false;
    }

    const requiredKeys = [
        'PREFIXES', 'STAFF_ROLE_ID', 'MEMBER_ROLE_ID',
        'TICKET_LOG_CHANNEL_ID', 'MOD_LOG_CHANNEL_ID',
        'SKULLBOARD_CHANNEL_ID', 'SUGGESTIONS_CHANNEL_ID',
        'SKULLBOARD_THRESHOLD'
    ];
    for (const key of requiredKeys) {
        if (config[key] === undefined) {
            console.log(`${ERROR} config.json missing key: ${key}`);
            ok = false;
        }
    }
    if (ok) console.log(`${SUCCESS} config.json has all required keys`);

    console.log('');
    return ok;
}

module.exports = { runPreflightChecks };