const { REST, Routes } = require('discord.js');
const { SUCCESS, WARNING, ERROR, INFO, RELOAD, GEAR } = require('../../emojis');

function normalizeCommand(cmd) {
    return JSON.stringify({
        name: cmd.name,
        description: cmd.description,
        options: cmd.options || [],
        default_member_permissions: cmd.default_member_permissions ?? null,
    });
}

module.exports = {
    name: 'clientReady',
    once: true,
    async execute(client, commands) {
        console.log(`${SUCCESS} Logged in as ${client.user.tag}`);

        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        let existing = [];
        try {
            existing = await rest.get(Routes.applicationCommands(process.env.CLIENT_ID));
        } catch (err) {
            console.error(`${ERROR} Failed to fetch existing commands from Discord:`, err);
        }

        const existingMap = new Map(existing.map(c => [c.name, c]));
        const newMap = new Map(commands.map(c => [c.name, c]));

        const added = [];
        const updated = [];
        const removed = [];
        let unchangedCount = 0;

        for (const [name, cmd] of newMap) {
            if (!existingMap.has(name)) {
                added.push(name);
            } else if (normalizeCommand(existingMap.get(name)) !== normalizeCommand(cmd)) {
                updated.push(name);
            } else {
                unchangedCount++;
            }
        }

        for (const name of existingMap.keys()) {
            if (!newMap.has(name)) removed.push(name);
        }

        console.log(`${INFO} Syncing slash commands with Discord...`);
        if (added.length) console.log(`${SUCCESS} Added:     ${added.join(', ')}`);
        if (updated.length) console.log(`${RELOAD} Updated:   ${updated.join(', ')}`);
        if (removed.length) console.log(`${WARNING} Removed:   ${removed.join(', ')}`);
        if (unchangedCount) console.log(`${GEAR} Unchanged: ${unchangedCount} command(s)`);
        if (!added.length && !updated.length && !removed.length) {
            console.log(`${SUCCESS} No changes \u2014 commands already in sync.`);
        }

        try {
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
            console.log(`${SUCCESS} Sync complete \u2014 ${commands.length} command(s) live on Discord, no ghosts left behind.`);
        } catch (err) {
            console.error(`${ERROR} Failed to register commands:`, err);
        }
        console.log(`${SUCCESS} \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500`);
        console.log(`${SUCCESS} TheSkull is online \u2014 serving ${client.guilds.cache.size} guild(s) as ${client.user.tag}`);
        console.log(`${SUCCESS} \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500`);
    }
};