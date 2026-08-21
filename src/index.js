const { WARNING, SUCCESS, INFO, ERROR } = require('./emojis');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ quiet: true });
const { runPreflightChecks } = require('./utils/preflight');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildModeration
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});
client.commands = new Collection();
client.prefixCommands = new Collection();
const commands = [];
function loadCommands(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            loadCommands(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
            const command = require(fullPath);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                commands.push(command.data.toJSON());
            } else {
                console.warn(`${WARNING} Skipped ${fullPath} \u2014 missing "data" or "execute" export.`);
            }
        }
    }
}
loadCommands(path.join(__dirname, 'commands'));
console.log(`${SUCCESS} Loaded ${commands.length} slash commands.`);
let prefixCount = 0;
function loadPrefixCommands(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            loadPrefixCommands(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
            const command = require(fullPath);
            if ('name' in command && 'execute' in command) {
                client.prefixCommands.set(command.name, command);
                prefixCount++;
            } else {
                console.warn(`${WARNING} Skipped ${fullPath} \u2014 missing "name" or "execute" export.`);
            }
        }
    }
}
loadPrefixCommands(path.join(__dirname, 'prefixCommands'));
console.log(`${SUCCESS} Loaded ${prefixCount} prefix commands.`);

function loadEvents(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let count = 0;
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            count += loadEvents(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
            const event = require(fullPath);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(client, commands, ...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
            count++;
        }
    }
    return count;
}
const eventCount = loadEvents(path.join(__dirname, 'events'));
console.log(`${SUCCESS} Loaded ${eventCount} events.`);

if (!runPreflightChecks()) {
    console.error(`${ERROR} Preflight checks failed — fix the above before the bot can start.`);
    process.exit(1);
}

console.log(`${INFO} Attempting to log in...`);
client.login(process.env.TOKEN)
    .then(() => console.log(`${SUCCESS} Login promise resolved — waiting for gateway handshake...`))
    .catch(err => {
        if (err.code === 'TokenInvalid') {
            console.error(`${ERROR} Login failed: TOKEN is invalid or revoked. Regenerate it in the Developer Portal.`);
        } else if (String(err.message).toLowerCase().includes('disallowed intents')) {
            console.error(`${ERROR} Login failed: a privileged intent is enabled in code but not toggled on in the Developer Portal (check MESSAGE CONTENT / SERVER MEMBERS).`);
        } else {
            console.error(`${ERROR} Login failed:`, err);
        }
        process.exit(1);
    });