const { BOOK, HAMMER, PARTY, WRENCH, SPARKLES, SLEEP, SHIELD, EYES } = require('../../emojis');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const CATEGORY_ORDER = ['moderation', 'fun', 'utility', 'suggestion', 'profile', 'misc', 'afk', 'admin'];
const CATEGORY_LABELS = {
    moderation: 'Moderation',
    fun: 'Fun',
    utility: 'Utility',
    suggestion: 'Suggestions',
    profile: 'Profile',
    misc: 'Misc',
    afk: 'AFK',
    admin: 'Admin Only',
};
const CATEGORY_EMOJI = {
    moderation: HAMMER,
    fun: PARTY,
    utility: WRENCH,
    suggestion: SPARKLES,
    profile: EYES,
    misc: SPARKLES,
    afk: SLEEP,
    admin: SHIELD,
};
const CATEGORY_OVERRIDE = { afk: 'afk' };

function normalize(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function walk(dir, baseDir, onFile) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(fullPath, baseDir, onFile);
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
            const category = path.relative(baseDir, fullPath).split(path.sep)[0];
            onFile(fullPath, category);
        }
    }
}

function buildCommandMap() {
    const map = new Map();

    const commandsPath = path.join(__dirname, '..', '..', 'commands');
    walk(commandsPath, commandsPath, (filePath, category) => {
        let command;
        try { command = require(filePath); } catch { return; }
        if (!command?.data?.name) return;
        const key = normalize(command.data.name);
        map.set(key, {
            name: command.data.name,
            desc: command.data.description || 'No description provided',
            category: CATEGORY_OVERRIDE[key] || category,
        });
    });

    return map;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all available commands'),

    async execute(interaction) {
        const commandMap = buildCommandMap();

        const byCategory = {};
        for (const entry of commandMap.values()) {
            const cat = entry.category || 'misc';
            (byCategory[cat] ||= []).push(entry);
        }

        const embed = new EmbedBuilder()
            .setTitle(`${BOOK} TheSkull \u2014 Command List`)
            .setColor('#00ffcc')
            .setDescription('Slash commands start with `/`')
            .setFooter({ text: 'TheSkull Bot' })
            .setTimestamp();

        const orderedCategories = [
            ...CATEGORY_ORDER.filter(c => byCategory[c]),
            ...Object.keys(byCategory).filter(c => !CATEGORY_ORDER.includes(c)),
        ];

        for (const cat of orderedCategories) {
            const entries = byCategory[cat].sort((a, b) => a.name.localeCompare(b.name));
            const lines = entries.map(entry => `\`/${entry.name}\` \u2014 ${entry.desc}`);

            embed.addFields({
                name: `${CATEGORY_EMOJI[cat] || SPARKLES} ${CATEGORY_LABELS[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1))}`,
                value: lines.join('\n'),
                inline: false,
            });
        }

        await interaction.reply({ embeds: [embed] });
    }
};