# Contributing to TheSkull

Thanks for your interest in contributing. This project is licensed
under an All Rights Reserved license (see [LICENSE](./LICENSE)) —
by submitting a contribution, you agree that it becomes part of the
project under that same license, with all rights held by the
project owner. If that's not something you're comfortable with,
please don't submit a pull request.

## Before you start

Open an issue describing the bug or feature first, especially for
anything non-trivial. This avoids duplicate work and lets us agree
on the approach before you spend time on it.

## Getting set up

1. Fork the repository and clone your fork
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with a bot token for your own test bot/server
   (never use the production token):
   ```
   TOKEN=your-test-bot-token
   CLIENT_ID=your-test-bot-client-id
   ```
4. Copy `src/config.json` and fill it in with IDs from a test server
   you control — never commit real production IDs, tokens, or the
   `database.db` file
5. Run the bot against your test server:
   ```
   npm start
   ```

## Code style

Match the existing codebase:

- **No comments in code.** This project intentionally keeps source
  files comment-free — write self-explanatory code (clear function
  and variable names) instead of relying on comments to explain it.
- Follow the existing file structure: slash commands go in
  `commands/<category>/`, prefix commands in
  `prefixCommands/<category>/`, event handlers in `events/<type>/`,
  and any logic shared across multiple files goes in `handlers/`.
- Use the constants in `emojis.json` for any emoji in bot output —
  never paste a raw emoji character directly into a source file.
  Add new entries to `emojis.json` as `\u{...}` escape codes if the
  one you need doesn't exist yet.
- Keep all database access inside `src/database/database.js` — don't
  write raw SQL queries in command or event files.

## Testing your changes

There's no automated test suite. Test manually against a Discord
server you control:

- For a new or changed slash command, confirm it appears correctly
  in `/help` and actually runs without errors
- For anything touching the database, confirm existing data isn't
  broken by restarting the bot and checking it still loads
- For anything touching `config.json`'s shape (new keys, etc.),
  update the README's setup section to match

## Submitting a pull request

- Keep pull requests focused on one change — don't bundle unrelated
  fixes together
- Describe what changed and why in the PR description
- Make sure `node --check` passes on every file you touched (no
  syntax errors) before submitting
- Don't include `node_modules/`, `.env`, or any `database.db*` files
  in your commit — check `.gitignore` is doing its job