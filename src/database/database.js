const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.db'));

db.pragma('journal_mode = WAL');

db.exec(`
    CREATE TABLE IF NOT EXISTS warnings (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id     TEXT NOT NULL,
        reason      TEXT NOT NULL,
        moderator   TEXT NOT NULL,
        date        TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS suggestions (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        msg_id      TEXT NOT NULL,
        channel_id  TEXT NOT NULL,
        count       INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS afk (
        user_id     TEXT PRIMARY KEY,
        reason      TEXT NOT NULL,
        since       INTEGER NOT NULL,
        pings       INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS skullboard (
        msg_id      TEXT PRIMARY KEY
    );

    CREATE TABLE IF NOT EXISTS profiles (
        user_id     TEXT PRIMARY KEY,
        bio         TEXT,
        city        TEXT,
        pronouns    TEXT,
        timezone    TEXT,
        age         TEXT,
        skills      TEXT,
        portfolio   TEXT,
        github      TEXT
    );
`);

const warnings = {
    add(userId, reason, moderator, date) {
        return db.prepare(
            'INSERT INTO warnings (user_id, reason, moderator, date) VALUES (?, ?, ?, ?)'
        ).run(userId, reason, moderator, date);
    },

    get(userId) {
        return db.prepare(
            'SELECT * FROM warnings WHERE user_id = ? ORDER BY id ASC'
        ).all(userId);
    },

    remove(userId, index) {
        const rows = warnings.get(userId);
        if (!rows.length || index < 1 || index > rows.length) return null;
        const target = rows[index - 1];
        db.prepare('DELETE FROM warnings WHERE id = ?').run(target.id);
        return target;
    },

    clearAll(userId) {
        return db.prepare('DELETE FROM warnings WHERE user_id = ?').run(userId);
    }
};

const suggestions = {
    add(msgId, channelId, count) {
        return db.prepare(
            'INSERT INTO suggestions (msg_id, channel_id, count) VALUES (?, ?, ?)'
        ).run(msgId, channelId, count);
    },

    get(id) {
        return db.prepare('SELECT * FROM suggestions WHERE id = ?').get(id);
    },

    getByMsgId(msgId) {
        return db.prepare('SELECT * FROM suggestions WHERE msg_id = ?').get(msgId);
    },

    getNextCount() {
        const row = db.prepare('SELECT COUNT(*) as total FROM suggestions').get();
        return row.total + 1;
    },

    updateCount(newCount) {
        
        return newCount;
    },

    resetAll() {
        db.prepare('DELETE FROM suggestions').run();
        db.prepare("DELETE FROM sqlite_sequence WHERE name = 'suggestions'").run();
    }
};

const afk = {
    set(userId, reason) {
        return db.prepare(
            'INSERT OR REPLACE INTO afk (user_id, reason, since, pings) VALUES (?, ?, ?, 0)'
        ).run(userId, reason, Date.now());
    },

    get(userId) {
        return db.prepare('SELECT * FROM afk WHERE user_id = ?').get(userId);
    },

    remove(userId) {
        return db.prepare('DELETE FROM afk WHERE user_id = ?').run(userId);
    },

    incrementPings(userId) {
        return db.prepare(
            'UPDATE afk SET pings = pings + 1 WHERE user_id = ?'
        ).run(userId);
    }
};

const skullboard = {
    has(msgId) {
        return !!db.prepare('SELECT 1 FROM skullboard WHERE msg_id = ?').get(msgId);
    },

    add(msgId) {
        return db.prepare(
            'INSERT OR IGNORE INTO skullboard (msg_id) VALUES (?)'
        ).run(msgId);
    }
};

const PROFILE_FIELDS = ['bio', 'city', 'pronouns', 'timezone', 'age', 'skills', 'portfolio', 'github'];

const profiles = {
    ensure(userId) {
        return db.prepare('INSERT OR IGNORE INTO profiles (user_id) VALUES (?)').run(userId);
    },

    get(userId) {
        profiles.ensure(userId);
        return db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(userId);
    },

    update(userId, field, value) {
        if (!PROFILE_FIELDS.includes(field)) {
            throw new Error(`Invalid profile field: ${field}`);
        }
        profiles.ensure(userId);
        return db.prepare(`UPDATE profiles SET ${field} = ? WHERE user_id = ?`).run(value, userId);
    },

    remove(userId) {
        return db.prepare('DELETE FROM profiles WHERE user_id = ?').run(userId);
    }
};

module.exports = { warnings, suggestions, afk, skullboard, profiles };