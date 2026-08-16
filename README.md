# TheSkull

A custom Discord bot built for The Skull, combining moderation tools,
a ticket system, community engagement features, and member profiles
into one bot with both slash and prefix commands.

## Features

**Moderation**
- Warn, kick, timeout, and purge commands
- Full warning history per user (`/check-warn`, `/remove-warn`)
- Automated mod-log embeds for kicks, bans, and timeouts
- Auto-role assignment on member join
- Automatic data cleanup on leave, kick, or ban (warnings, AFK
  status, and profile data are cleared to keep the database lean)

**Tickets**
- Category-based ticket panel (select menu)
- Staff claim/close flow with a required close reason
- Full ticket log embeds posted to a dedicated channel

**Skullboard**
- Reposts messages that cross a configurable 💀 reaction threshold
- Duplicate-safe (checks recent skullboard posts before reposting)

**Suggestions**
- Community suggestion submission with auto-numbering
- Staff approve/deny commands
- Admin reset command to wipe all suggestions and restart numbering

**AFK**
- Set an AFK status with a reason
- Auto-clears on your next message
- Notifies (and auto-deletes) when an AFK user is mentioned, with a
  ping counter

**Profiles**
- `/profile` and `/edit-profile` — bio, city, pronouns, timezone,
  age, skills, portfolio link, and GitHub link, all optional
- Generated image profile card (not a plain embed) with the
  member's avatar, badges, and info
- Special role badges (e.g. Bug Hunter, GitHub Contributor) shown as
  real custom-emoji icons, configured per-role in `config.json`
- Blank profile automatically created when a member joins

**Everything else**
- Fun commands: ASCII art, Base64/Hex encode-decode, a math
  calculator
- Utility commands: avatar, user info, server info, GitHub repo info
- Admin-only prefix commands: say, react, and hot-reload (reload a
  command without restarting the bot)
- Dynamic `/help` command — pulls its list straight from the
  commands that actually exist, so it never goes stale
- Supports multiple command prefixes at once (e.g. `x!` and `.`)

## Tech Stack

- [discord.js](https://discord.js.org/) v14
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) for
  persistent storage
- [@napi-rs/canvas](https://github.com/Brooooooklyn/canvas) for
  generated profile card images
- [axios](https://axios-http.com/) for the GitHub repo-info command
- [figlet](https://www.npmjs.com/package/figlet) for ASCII art
- [mathjs](https://mathjs.org/) for the calculator command
- [dotenv](https://www.npmjs.com/package/dotenv) for environment
  variables

## Project Structure

```
src/
  index.js              Bot entry point — loads commands, prefix
                         commands, and events, then logs in
  config.json            Server-specific IDs and settings
  emojis.json             All emoji used by the bot, stored as
                          Unicode escapes so the file can never get
                          corrupted by editor/encoding issues
  commands/               Slash commands, organized by category
  prefixCommands/          Prefix (x!) commands, organized by category
  events/                   Discord event handlers
  handlers/                  Shared logic used by multiple commands
                              or events (tickets, AFK, skullboard,
                              profile cards, member data cleanup)
  database/
    database.js              SQLite setup and all query functions
    database.db               Live database (not committed to git)
```

## Setup

**Requirements:** Node.js 18 or newer.

1. **Clone the repository** and install dependencies:
   ```
   npm install
   ```

2. **Create a `.env` file** in the project root with your bot's
   credentials:
   ```
   TOKEN=your-bot-token-here
   CLIENT_ID=your-application-client-id-here
   ```

3. **Fill in `src/config.json`** with your server's actual IDs:
   - `PREFIXES` — an array of prefix strings your bot should respond
     to (e.g. `["x!", "."]`)
   - `STAFF_ROLE_ID`, `MEMBER_ROLE_ID` — role IDs used for
     permissions and auto-role
   - `TICKET_LOG_CHANNEL_ID`, `MOD_LOG_CHANNEL_ID`,
     `SKULLBOARD_CHANNEL_ID`, `SUGGESTIONS_CHANNEL_ID` — channel IDs
     the bot posts to
   - `SKULLBOARD_THRESHOLD` — how many 💀 reactions trigger a repost
   - `ROLE_BADGES` — maps a role ID to a badge shown on profiles:
     ```json
     "ROLE_BADGES": {
         "your-role-id": { "title": "Badge Name", "emoji": "<:emojiname:emoji-id>" }
     }
     ```
     The emoji must be a custom emoji already uploaded to your
     server. Type a backslash then the emoji name (e.g. `\:name:`)
     in any channel to get its raw `<:name:id>` format.

4. **Start the bot:**
   ```
   npm start
   ```
   This automatically installs any missing dependencies first, then
   starts the bot and syncs its slash commands with Discord.

On every startup, the console shows exactly which slash commands
were added, updated, removed, or left unchanged compared to what
Discord currently has registered — so command drift is always
visible, not silent.

## License

All rights reserved. See [LICENSE](./LICENSE) for details — this
code is publicly viewable but may not be copied, modified,
redistributed, or used without prior written permission.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).