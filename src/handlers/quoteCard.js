const { createCanvas, loadImage } = require('@napi-rs/canvas');

const WIDTH = 1200;
const HEIGHT = 675;
const AVATAR_W = WIDTH * 0.42;
const SANS = 'Arial, "Helvetica Neue", sans-serif';

function wrapLines(ctx, text, maxWidth) {
    const words = text.split(/\s+/);
    const lines = [];
    let current = '';
    for (const word of words) {
        const test = current ? `${current} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && current) {
            lines.push(current);
            current = word;
        } else {
            current = test;
        }
    }
    if (current) lines.push(current);
    return lines;
}

function fitText(ctx, text, maxWidth, maxHeight, startSize, minSize) {
    for (let size = startSize; size >= minSize; size -= 2) {
        ctx.font = `600 ${size}px ${SANS}`;
        const lines = wrapLines(ctx, text, maxWidth);
        const lineHeight = size * 1.3;
        if (lines.length * lineHeight <= maxHeight) {
            return { size, lines, lineHeight };
        }
    }
    ctx.font = `600 ${minSize}px ${SANS}`;
    const lines = wrapLines(ctx, text, maxWidth);
    const lineHeight = minSize * 1.3;
    const maxLines = Math.max(1, Math.floor(maxHeight / lineHeight));
    if (lines.length > maxLines) {
        const kept = lines.slice(0, maxLines);
        kept[kept.length - 1] = kept[kept.length - 1].replace(/\s*\S*$/, '') + '…';
        return { size: minSize, lines: kept, lineHeight };
    }
    return { size: minSize, lines, lineHeight };
}

function grayscale(ctx, x, y, w, h) {
    const imgData = ctx.getImageData(x, y, w, h);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
        const avg = d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11;
        d[i] = avg;
        d[i + 1] = avg;
        d[i + 2] = avg;
    }
    ctx.putImageData(imgData, x, y);
}

async function generateQuoteImage({ avatarURL, displayName, text }) {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    try {
        const res = await fetch(avatarURL);
        const buf = Buffer.from(await res.arrayBuffer());
        const img = await loadImage(buf);

        const pad = 20;
        const boxW = AVATAR_W - pad * 2;
        const boxH = HEIGHT - pad * 2;
        const scale = Math.min(boxW / img.width, boxH / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        const dx = pad + (boxW - dw) / 2;
        const dy = pad + (boxH - dh) / 2;
        ctx.drawImage(img, dx, dy, dw, dh);
        grayscale(ctx, 0, 0, AVATAR_W, HEIGHT);
    } catch (err) {
        console.error('Failed to load avatar for quote card:', err);
        ctx.fillStyle = '#1a1a1e';
        ctx.fillRect(0, 0, AVATAR_W, HEIGHT);
    }

    const fadeStart = AVATAR_W * 0.32;
    const fade = ctx.createLinearGradient(fadeStart, 0, AVATAR_W - 10, 0);
    fade.addColorStop(0, 'rgba(10,10,12,0)');
    fade.addColorStop(0.45, 'rgba(10,10,12,0.25)');
    fade.addColorStop(0.75, 'rgba(10,10,12,0.7)');
    fade.addColorStop(1, 'rgba(10,10,12,1)');
    ctx.fillStyle = fade;
    ctx.fillRect(fadeStart, 0, WIDTH - fadeStart, HEIGHT);

    const vignette = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    vignette.addColorStop(0, 'rgba(0,0,0,0.25)');
    vignette.addColorStop(0.5, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, AVATAR_W, HEIGHT);

    const panelX = AVATAR_W + 40;
    const panelW = WIDTH - panelX - 60;
    const textMaxW = panelW;
    const textMaxH = HEIGHT - 260;

    ctx.font = `600 ${Math.min(160, textMaxH)}px ${SANS}`;
    const { size, lines, lineHeight } = fitText(ctx, text, textMaxW, textMaxH, 64, 24);

    const blockH = lines.length * lineHeight;
    const sigGap = 56;
    const totalH = blockH + sigGap;
    let ty = (HEIGHT - totalH) / 2 + size * 0.85;

    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f5f5f7';
    ctx.font = `600 ${size}px ${SANS}`;
    ctx.textAlign = 'center';
    const centerX = panelX + panelW / 2;
    for (const line of lines) {
        ctx.fillText(line, centerX, ty);
        ty += lineHeight;
    }

    ctx.fillStyle = 'rgba(200,200,208,0.75)';
    ctx.font = `400 ${Math.round(size * 0.42)}px ${SANS}`;
    ctx.fillText(`- ${displayName}`, centerX, ty + sigGap * 0.35);
    ctx.textAlign = 'left';

    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    ctx.font = `700 110px Georgia, serif`;
    ctx.textAlign = 'left';
    ctx.fillText('\u201C', panelX - 6, 92);
    ctx.textAlign = 'right';
    ctx.fillText('\u201D', WIDTH - 40, HEIGHT - 18);
    ctx.textAlign = 'left';

    return canvas.toBuffer('image/png');
}

async function resolveQuoteAuthor(interaction, user) {
    const member = interaction.guild
        ? await interaction.guild.members.fetch(user.id).catch(() => null)
        : null;
    return {
        displayName: member ? member.displayName : user.username,
        avatarURL: (member ?? user).displayAvatarURL({ extension: 'png', size: 512 })
    };
}

const CUSTOM_EMOJI_REGEX = /<a?:\w+:\d+>/;

function containsCustomEmoji(text) {
    return CUSTOM_EMOJI_REGEX.test(text);
}

module.exports = { generateQuoteImage, containsCustomEmoji, resolveQuoteAuthor };