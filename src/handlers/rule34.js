const axios = require('axios');
const {
    ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags,
    ContainerBuilder, TextDisplayBuilder, MediaGalleryBuilder, SeparatorBuilder, SeparatorSpacingSize
} = require('discord.js');
const config = require('../config.json');

const IMAGE_KEYWORDS = [
    'ass', 'cum', 'tits', 'boobs', 'pussy', 'dick', 'anal', 'blowjob',
    'threesome', 'nude', 'naked', 'exposed', 'penetration', 'handjob',
    'footjob', 'paizuri', 'tentacle', 'gangbang', 'hardcore', 'creampie',
    'masturbation', 'orgasm', 'lingerie', 'bikini', 'panties', 'bra',
    'upskirt', 'hentai', 'ecchi', 'nsfw', 'rule34', 'xxx'
];
const DARK_GREY = 0x2C2F33;
const VIDEO_EXT = /\.(mp4|webm)$/i;
const IMAGE_EXT = /\.(jpg|jpeg|png|gif|webp)$/i;
const RATE_LIMIT_HINT = 'Rule34 API is rate limited. Please wait a few seconds and try again.';
const COOLDOWN_MS = 3000;
const userCooldowns = new Map();

function isImageQuery(query) {
    const words = query.toLowerCase().split(/\s+/);
    return words.some(w => IMAGE_KEYWORDS.includes(w));
}

function isVideoUrl(url) {
    return VIDEO_EXT.test(url || '');
}

function isImageUrl(url) {
    return IMAGE_EXT.test(url || '');
}

function checkCooldown(userId) {
    const now = Date.now();
    const last = userCooldowns.get(userId) || 0;
    if (now - last < COOLDOWN_MS) {
        return Math.ceil((COOLDOWN_MS - (now - last)) / 1000);
    }
    userCooldowns.set(userId, now);
    return 0;
}

const V1_BASE = 'https://top.gg/api/v1';
let projectInfo = null;

async function getProjectInfo() {
    if (projectInfo) return projectInfo;
    const token = process.env.TOP_GG_TOKEN;
    if (!token) return null;
    try {
        const { data } = await axios.get(`${V1_BASE}/projects/@me`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000
        });
        if (!data || !data.id) return null;
        projectInfo = {
            projectId: data.id,
            platformId: data.platform_id || data.id,
            name: data.name,
            type: data.type
        };
    } catch {
        return null;
    }
    return projectInfo;
}

function voteUrl(info, fallbackClientId) {
    const overrideId = process.env.TOP_GG_VOTE_ID;
    const platformId = overrideId || (info && info.platformId) || fallbackClientId;
    const path = info && info.type === 'server' ? 'discord/servers' : 'bot';
    return `https://top.gg/${path}/${platformId}/vote`;
}

async function checkVote(userId) {
    const token = process.env.TOP_GG_TOKEN;
    if (!token) return true;
    const info = await getProjectInfo();
    if (!info) return true;
    try {
        const { status, data } = await axios.get(`${V1_BASE}/projects/@me/votes/${userId}`, {
            params: { source: 'discord' },
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
            validateStatus: () => true
        });
        if (status !== 200) return false;
        if (!data || !data.expires_at) return false;
        return Date.parse(data.expires_at) > Date.now();
    } catch {
        return true;
    }
}

async function searchRule34(query, type = 'any', limit = 100) {
    const apiKey = process.env.RULE34_API_KEY;
    const userId = process.env.RULE34_USER_ID;

    if (!apiKey || !userId) {
        return { error: true, message: 'Rule34 API credentials not configured. Add RULE34_API_KEY and RULE34_USER_ID to `.env`.' };
    }

    const tags = `${query} rating:explicit -real`;
    const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${encodeURIComponent(tags)}&limit=${limit}&json=1&api_key=${apiKey}&user_id=${userId}`;

    try {
        const { data } = await axios.get(url, { timeout: 10000, validateStatus: () => true });

        if (typeof data === 'string' || !data || !Array.isArray(data)) {
            const body = typeof data === 'string' ? data : '';
            if (/rate|limit|throttl|429/i.test(body)) {
                return { error: true, message: RATE_LIMIT_HINT, rateLimited: true };
            }
            return { error: true, message: body ? `Rule34 API error: ${body.slice(0, 200)}` : 'Rule34 API returned an invalid response.' };
        }

        if (data.length === 0) return null;

        let filtered;
        if (type === 'images') {
            filtered = data.filter(p => p.file_url && isImageUrl(p.file_url));
        } else if (type === 'videos') {
            filtered = data.filter(p => p.file_url && isVideoUrl(p.file_url));
        } else {
            filtered = data.filter(p => p.file_url);
        }

        if (type === 'videos' && filtered.length === 0) {
            return { noMatch: true, useImage: false };
        }
        if (type === 'images' && filtered.length === 0) {
            return { noMatch: true, useImage: true };
        }
        if (filtered.length === 0) return null;

        const post = filtered[Math.floor(Math.random() * filtered.length)];
        return { post, useImage: !isVideoUrl(post.file_url) };
    } catch (err) {
        const status = err.response && err.response.status;
        if (status === 429) {
            return { error: true, message: RATE_LIMIT_HINT, rateLimited: true };
        }
        return { error: true, message: `API request failed: ${err.message}` };
    }
}

function buildHelpPayload() {
    const text = new TextDisplayBuilder().setContent(
        '**Rule34 Search**\nSearch Rule34 for anime/hentai content.\n\n' +
        '**Usage:** `>r34 <query> <type>`\n' +
        '**Types:** `image` `video` `random` (default: random)\n\n' +
        '**Examples:**\n' +
        '`>r34 naruto image` \u2014 image results\n' +
        '`>r34 naruto video` \u2014 video results\n' +
        '`>r34 naruto` \u2014 random results\n\n' +
        '-# Anime/hentai only \u2014 no real humans.'
    );
    const container = new ContainerBuilder()
        .setAccentColor(DARK_GREY)
        .addTextDisplayComponents(text);

    return { components: [container], flags: MessageFlags.IsComponentsV2 };
}

function buildLoadingPayload(user) {
    const text = new TextDisplayBuilder().setContent(`Searching...\n\n-# Requested by ${user.tag}`);
    const container = new ContainerBuilder()
        .setAccentColor(DARK_GREY)
        .addTextDisplayComponents(text);

    return { components: [container], flags: MessageFlags.IsComponentsV2 };
}

function buildNoResultsPayload(query, wanted) {
    const text = new TextDisplayBuilder().setContent(`No ${wanted} found for \`${query}\`. Try a different search.`);
    const container = new ContainerBuilder()
        .setAccentColor(DARK_GREY)
        .addTextDisplayComponents(text);

    return { components: [container], flags: MessageFlags.IsComponentsV2 };
}

function buildErrorPayload(message) {
    const text = new TextDisplayBuilder().setContent(message);
    const container = new ContainerBuilder()
        .setAccentColor(DARK_GREY)
        .addTextDisplayComponents(text);

    return { components: [container], flags: MessageFlags.IsComponentsV2 };
}

async function buildVoteRequiredPayload(fallbackClientId) {
    const info = await getProjectInfo();
    const target = info && info.type === 'server' ? 'the server' : 'the bot';
    const name = info && info.name ? `**${info.name}**` : 'the bot';
    const text = new TextDisplayBuilder().setContent(
        `**Vote Required**\nYou must vote for ${name} (${target}) on top.gg before using this command!\n\n**Vote here:** ${voteUrl(info, fallbackClientId)}`
    );
    const container = new ContainerBuilder()
        .setAccentColor(DARK_GREY)
        .addTextDisplayComponents(text);

    return { components: [container], flags: MessageFlags.IsComponentsV2 };
}

function buildResultPayload(post, query, user, pageNum = 1) {
    const category = isImageQuery(query) ? 'Custom' : 'Random';

    const media = new MediaGalleryBuilder().addItems(
        (item) => item.setURL(post.file_url).setDescription('Rule34 result')
    );

    const loadMore = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('r34more')
            .setLabel('Load More')
            .setStyle(ButtonStyle.Secondary)
    );

    const header = new TextDisplayBuilder().setContent(
        `NSFW: /rule34\nCategory: ${category}\nPage ${pageNum} | Requested by ${user.tag}`
    );

    const container = new ContainerBuilder()
        .setAccentColor(DARK_GREY)
        .addMediaGalleryComponents(media)
        .addSeparatorComponents((sep) => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Small))
        .addTextDisplayComponents(header)
        .addActionRowComponents(loadMore);

    return { components: [container], flags: MessageFlags.IsComponentsV2 };
}

function attachLoadMore(msg, user, query, type, pageNum) {
    const collector = msg.createMessageComponentCollector({
        filter: (i) => i.user.id === user.id && i.customId === 'r34more',
        time: 120000,
        max: 10
    });

    collector.on('collect', async (i) => {
        await i.deferUpdate();

        const wait = checkCooldown(user.id);
        if (wait > 0) {
            return i.followUp({ content: `Please wait ${wait}s before requesting more.`, flags: MessageFlags.Ephemeral });
        }

        const nextResult = await searchRule34(query, type);

        if (nextResult && nextResult.error) {
            return msg.edit(buildErrorPayload(nextResult.message));
        }
        if (!nextResult || !nextResult.post) {
            return msg.edit(buildErrorPayload('No more results found for that query.'));
        }

        await msg.edit(buildResultPayload(nextResult.post, query, user, pageNum));
        attachLoadMore(msg, user, query, type, pageNum + 1);
    });
}

async function handleR34Command(source, query, type = 'any') {
    const user = source.author || source.user;
    const isSlash = !!source.isChatInputCommand;

    let msg;
    if (isSlash) {
        await source.deferReply();
        msg = await source.editReply(buildLoadingPayload(user));
    } else {
        msg = await source.reply(buildLoadingPayload(user));
    }

    const wait = checkCooldown(user.id);
    if (wait > 0) {
        return msg.edit(buildErrorPayload(`Please wait ${wait}s before using this command again.`));
    }

    const result = await searchRule34(query, type);

    if (result && result.error) {
        return msg.edit(buildErrorPayload(result.message));
    }

    if (!result) {
        return msg.edit(buildErrorPayload('No results found.'));
    }

    if (result.noMatch) {
        const wanted = result.useImage ? 'images' : 'videos';
        return msg.edit(buildNoResultsPayload(query, wanted));
    }

    await msg.edit(buildResultPayload(result.post, query, user, 1));
    attachLoadMore(msg, user, query, type, 2);
}

module.exports = { handleR34Command, buildHelpPayload, buildErrorPayload, buildVoteRequiredPayload, checkVote, IMAGE_KEYWORDS, DARK_GREY };