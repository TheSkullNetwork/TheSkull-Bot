const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { profiles } = require('../database/database.js');
const { getBadges } = require('./profile');

const WIDTH = 800;
const PAD = 48;
const AV_SIZE = 100;

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

function blob(ctx, x, y, radius, color) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, `${color}aa`);
    g.addColorStop(1, `${color}00`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

async function fetchImageBuffer(url) {
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

function parseEmojiUrl(emojiString) {
    const match = /^<(a)?:\w+:(\d+)>$/.exec(emojiString || '');
    if (!match) return null;
    const [, animated, id] = match;
    return `https://cdn.discordapp.com/emojis/${id}.${animated ? 'gif' : 'png'}?size=48`;
}

async function generateProfileCard(member) {
    const data = profiles.get(member.id);
    const badges = getBadges(member);

    const fields = [
        ['City', data.city],
        ['Pronouns', data.pronouns],
        ['Timezone', data.timezone],
        ['Age', data.age],
        ['Skills', data.skills],
    ].filter(([, v]) => v);
    const rows = Math.ceil(fields.length / 2);
    const TILE_H = 68;
    const TILE_GAP = 14;
    const fieldsBlockH = fields.length ? rows * TILE_H + (rows - 1) * TILE_GAP : 0;

    let height = PAD + 20 + AV_SIZE + 46;
    const panelH = 40 + (fields.length ? fieldsBlockH + 26 : 0) + 40;
    height += panelH + 20;

    const canvas = createCanvas(WIDTH, height);
    const ctx = canvas.getContext('2d');

    roundRect(ctx, 0, 0, WIDTH, height, 24);
    ctx.clip();

    ctx.fillStyle = '#0b0b12';
    ctx.fillRect(0, 0, WIDTH, height);

    blob(ctx, WIDTH * 0.15, 60, 260, '#4F5BD5');
    blob(ctx, WIDTH * 0.82, 40, 300, '#2EC5CE');
    blob(ctx, WIDTH * 0.62, height * 0.6, 320, '#7B4FD5');
    blob(ctx, WIDTH * 0.1, height * 0.85, 260, '#2E86C5');

    ctx.globalAlpha = 0.03;
    for (let i = 0; i < 1500; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
        ctx.fillRect(Math.random() * WIDTH, Math.random() * height, 1, 1);
    }
    ctx.globalAlpha = 1;

    let y = PAD + 20;

    ctx.beginPath();
    ctx.arc(PAD + AV_SIZE / 2, y + AV_SIZE / 2, AV_SIZE / 2 + 4, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    try {
        const avatarBuf = await fetchImageBuffer(member.user.displayAvatarURL({ extension: 'png', size: 256 }));
        const avatarImg = await loadImage(avatarBuf);
        ctx.save();
        ctx.beginPath();
        ctx.arc(PAD + AV_SIZE / 2, y + AV_SIZE / 2, AV_SIZE / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImg, PAD, y, AV_SIZE, AV_SIZE);
        ctx.restore();
    } catch (err) {
        console.error('Failed to load avatar for profile card:', err);
        ctx.save();
        ctx.beginPath();
        ctx.arc(PAD + AV_SIZE / 2, y + AV_SIZE / 2, AV_SIZE / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.fillStyle = '#4F5BD5';
        ctx.fillRect(PAD, y, AV_SIZE, AV_SIZE);
        ctx.restore();
    }

    const textX = PAD + AV_SIZE + 26;
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 28px sans-serif';
    ctx.fillText(member.user.username, textX, y + 40);

    if (badges.length) {
        ctx.font = '600 12px sans-serif';
        let bx = textX;
        const badgeY = y + 62;
        for (const badge of badges) {
            const label = badge.title.toUpperCase();
            const w = ctx.measureText(label).width + 20;
            roundRect(ctx, bx, badgeY - 16, w, 24, 12);
            ctx.fillStyle = 'rgba(255,255,255,0.12)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.25)';
            ctx.lineWidth = 1;
            roundRect(ctx, bx, badgeY - 16, w, 24, 12);
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.fillText(label, bx + 10, badgeY);
            bx += w + 8;
        }
    }

    y += AV_SIZE + 46;

    const panelY = y - 14;
    roundRect(ctx, PAD - 20, panelY, WIDTH - PAD * 2 + 40, panelH, 16);
    ctx.fillStyle = 'rgba(12,12,18,0.55)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    roundRect(ctx, PAD - 20, panelY, WIDTH - PAD * 2 + 40, panelH, 16);
    ctx.stroke();

    y += 18;
    if (data.bio) {
        ctx.fillStyle = '#d4d4da';
        ctx.font = '16px sans-serif';
        ctx.fillText(data.bio, PAD, y);
    }
    y += 40;

    if (fields.length) {
        const colGap = 16;
        const colW = (WIDTH - PAD * 2 - colGap) / 2;

        fields.forEach(([label, val], i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const tx = PAD + col * (colW + colGap);
            const ty = y + row * (TILE_H + TILE_GAP);

            roundRect(ctx, tx, ty, colW, TILE_H, 12);
            ctx.fillStyle = 'rgba(255,255,255,0.05)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 1;
            roundRect(ctx, tx, ty, colW, TILE_H, 12);
            ctx.stroke();

            const innerX = tx + 16;
            ctx.fillStyle = '#8f9098';
            ctx.font = '600 10.5px sans-serif';
            ctx.fillText(label.toUpperCase(), innerX, ty + 25);

            ctx.fillStyle = '#f5f5f7';
            ctx.font = '600 17px sans-serif';
            ctx.fillText(val, innerX, ty + 49);
        });
        y += fieldsBlockH + 26;
    }

    if (member.joinedAt) {
        ctx.fillStyle = '#8a8b93';
        ctx.font = '12px sans-serif';
        ctx.fillText(`Joined ${member.joinedAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`, PAD, y);
    }

    return canvas.toBuffer('image/png');
}

module.exports = { generateProfileCard };