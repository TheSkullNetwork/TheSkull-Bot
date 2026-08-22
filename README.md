# TheSkull-Bot

[![GitHub Stars](https://img.shields.io/github/stars/TheSkullNetwork/TheSkull-Bot?style=flat-square&color=orange)](https://github.com/TheSkullNetwork/TheSkull-Bot/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/TheSkullNetwork/TheSkull-Bot?style=flat-square&color=blue)](https://github.com/TheSkullNetwork/TheSkull-Bot/network/members)
[![Primary Language](https://img.shields.io/github/languages/top/TheSkullNetwork/TheSkull-Bot?style=flat-square&color=yellow)](https://github.com/TheSkullNetwork/TheSkull-Bot)
[![License](https://img.shields.io/badge/License-Other-lightgrey?style=flat-square)](./LICENSE)
[![Discord](https://img.shields.io/badge/Discord-Join%20Us-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/7tSPQjtkhz)

---

## 🚀 Overview

TheSkull-Bot stands as the central pillar of The Skull Network's Discord community, a meticulously crafted custom bot designed to consolidate a wide array of server management, engagement, and utility features into a single, cohesive solution. This bot streamlines moderation tasks, enhances community interaction, and offers unique member profiling capabilities, ensuring a vibrant and well-organized Discord environment.

Developed with both efficiency and user experience in mind, TheSkull-Bot seamlessly integrates essential functionalities like a robust ticket system, an engaging "Skullboard" for noteworthy messages, and comprehensive AFK tracking. It empowers server staff with powerful tools while providing members with fun utilities and personalized profiles, all accessible via a flexible command structure supporting both slash commands and traditional prefixes.

This open-source project embodies the spirit of community-driven development, offering a powerful, all-in-one Discord bot solution for growing communities.

## ✨ Features

TheSkull-Bot provides a comprehensive suite of features tailored to meet the diverse needs of modern Discord communities:

### Moderation
*   **Warn, Kick, Timeout, Purge**: Essential commands for maintaining server decorum.
*   **Full Warning History**: Track warnings per user with `/check-warn` and `/remove-warn`.
*   **Automated Mod-Log**: Automatic embeds for kicks, bans, and timeouts posted to a dedicated channel.
*   **Auto-Role Assignment**: Assign roles to new members upon joining.
*   **Data Cleanup**: Automatically clears user-specific data (warnings, AFK status, profile data) upon leave, kick, or ban to optimize database performance.

### Tickets
*   **Category-Based Panels**: Users can open tickets via a select menu, categorized for various support needs.
*   **Staff Claim/Close Flow**: Structured process for staff to claim and close tickets, requiring a close reason.
*   **Full Ticket Logging**: Detailed ticket log embeds posted to a dedicated channel for audit purposes.

### Skullboard
*   **Reaction-Threshold Reposting**: Automatically reposts messages that accumulate a configurable number of 💀 reactions to a "skullboard" channel.
*   **Duplicate-Safe**: Intelligent system prevents reposting recently added skullboard messages.

### Suggestions
*   **Community Submission**: Members can submit suggestions, which are auto-numbered for easy reference.
*   **Staff Approval/Denial**: Dedicated commands for staff to approve or deny submitted suggestions.
*   **Admin Reset**: Command to clear all suggestions and reset numbering.

### AFK Tracking
*   **Set AFK Status**: Users can set an AFK status with a custom reason.
*   **Automatic Clear**: AFK status is automatically cleared upon the user's next message.
*   **Mention Notifications**: Notifies (and auto-deletes the notification) when an AFK user is mentioned, including a ping counter.

### Profiles
*   **Personalized Profiles**: Members can create and edit their profiles with `/profile` and `/edit-profile`, including bio, city, pronouns, timezone, age, skills, portfolio, and GitHub links (all optional).
*   **Generated Profile Card**: Displays user information on a custom-generated image card, not a plain embed, featuring their avatar, badges, and details.
*   **Special Role Badges**: Custom-emoji icons representing special roles (e.g., Bug Hunter, GitHub Contributor), configurable via `config.json`.
*   **Automatic Profile Creation**: A blank profile is automatically created for new members upon joining.

### Everything Else
*   **Fun Commands**: ASCII art generation, Base64/Hex encoding/decoding, and a powerful math calculator.
*   **Utility Commands**: Commands to fetch avatar, user info, server info, and GitHub repository information.
*   **Admin-Only Prefix Commands**: `say`, `react`, and `hot-reload` (to reload a command without restarting the bot).
*   **Dynamic Help Command**: The `/help` command dynamically pulls its list of commands, ensuring it's always up-to-date.
*   **Multiple Command Prefixes**: Supports multiple command prefixes simultaneously (e.g., `x!` and `.`).

## 🛠️ Tech Stack

TheSkull-Bot is built using a modern JavaScript stack, leveraging powerful libraries for robust functionality and efficient performance.

| Technology          | Version | Description                                                               |
| :------------------ | :------ | :------------------------------------------------------------------------ |
| Node.js             | ^18.x   | JavaScript runtime for server-side execution.                             |
| discord.js          | ^14.14.1 | Powerful library for interacting with the Discord API.                    |
| better-sqlite3      | ^11.3.0 | Fast, simple, and full-featured SQLite3 library for persistent storage.   |
| @napi-rs/canvas     | ^0.1.53 | High-performance Canvas API implementation for generating profile images. |
| axios               | ^1.7.7  | Promise-based HTTP client for making API requests (e.g., GitHub API).    |
| figlet              | ^1.7.0  | Module for creating ASCII art from text.                                  |
| mathjs              | ^13.0.0 | Extensive math library for numerical calculations.                        |
| dotenv              | ^16.4.5 | Loads environment variables from a `.env` file.                           |

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed and set up:

*   **Node.js**: Version 18.x or higher is recommended.
    *   [Download Node.js](https://nodejs.org/en/download)
*   **npm** (Node Package Manager): Usually comes bundled with Node.js.
*   **Git**: For cloning the repository.
    *   [Download Git](https://git-scm.com/downloads)
*   **A Discord Bot Token**:
    *   Go to the [Discord Developer Portal](https://discord.com/developers/applications).
    *   Create a new application or select an existing one.
    *   Navigate to "Bot" on the left sidebar.
    *   Click "Add Bot" and then "Yes, do it!".
    *   Copy the token. **Keep this token secret!**
*   **A Discord Server**: Where you have Administrator permissions to invite the bot and test its functionalities.

## 📦 Installation

Follow these steps to get TheSkull-Bot up and running on your local machine or server.

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/TheSkullNetwork/TheSkull-Bot.git
    cd TheSkull-Bot
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Create Environment File:**
    Create a file named `.env` in the root directory of the project.
    ```bash
    touch .env
    ```

4.  **Configure Environment Variables:**
    Open the newly created `.env` file and add your Discord bot token and client ID:
    ```ini
    DISCORD_TOKEN=YOUR_BOT_TOKEN_HERE
    CLIENT_ID=YOUR_BOT_CLIENT_ID_HERE
    ```
    *   Replace `YOUR_BOT_TOKEN_HERE` with the token copied from the Discord Developer Portal.
    *   Replace `YOUR_BOT_CLIENT_ID_HERE` with your application's client ID, also found in the Discord Developer Portal under "General Information".

5.  **Configure Bot Settings:**
    Navigate to the `src` directory. You will find `config.json` and `emojis.json`.
    *   **`src/config.json`**: This file contains server-specific IDs and settings. You will need to update `guildId`, `moderationLogChannelId`, `ticketLogChannelId`, `skullboardChannelId`, `suggestionChannelId`, and other relevant IDs to match your Discord server's setup. This also includes configuring custom role badges.
    *   **`src/emojis.json`**: This file stores all custom emoji Unicode escapes used by the bot. Ensure any custom emojis your bot will use are correctly configured here if needed.

## ▶️ Usage

Once installed and configured, you can run TheSkull-Bot.

1.  **Run the Bot:**
    ```bash
    npm start
    ```
    The bot should now start and connect to Discord. You will see console logs indicating successful login.

2.  **Invite the Bot to Your Server:**
    *   Go to the Discord Developer Portal, select your application, then navigate to "OAuth2" -> "URL Generator".
    *   Under "Scopes", select `bot` and `applications.commands`.
    *   Under "Bot Permissions", select the necessary permissions for your bot to function (e.g., `Administrator` for full functionality, or specific permissions like `Manage Channels`, `Kick Members`, `Send Messages`, `Read Message History`, etc.).
    *   Copy the generated URL and paste it into your browser to invite the bot to your server.

3.  **Register Slash Commands:**
    When the bot starts, it will attempt to register its slash commands. Ensure your `CLIENT_ID` is correct in `.env` and `guildId` is correct in `config.json`. Global slash commands can take up to an hour to propagate, but guild-specific commands are usually instant.

4.  **Start Using Commands:**
    Once the bot is online in your server, you can start using its features:
    *   Try a slash command like `/profile` to create your member profile.
    *   Use a prefix command (e.g., `x!ping` if `x!` is one of your configured prefixes).
    *   Interact with a ticket panel if you've set one up according to your `config.json`.

## 🔒 Environment Variables

TheSkull-Bot uses environment variables for sensitive data like API tokens. These are loaded from the `.env` file.

| Variable        | Description                                       | Example                 |
| :-------------- | :------------------------------------------------ | :---------------------- |
| `DISCORD_TOKEN` | Your Discord Bot's authentication token.          | `NzY5...Xk.Xxx...xxx`   |
| `CLIENT_ID`     | Your Discord Application's Client ID, used for slash command registration. | `123456789012345678`    |

## 📁 Project Structure

The project follows a clear and organized structure to manage different aspects of the bot's functionality.

```
.
├── .env                  # Environment variables for sensitive data (e.g., bot token)
├── Contributing.md       # Guidelines for contributing to the project
├── LICENSE               # Project license information
├── README.md             # This README file
├── package.json          # Node.js project manifest and dependency list
├── src/                  # Main source code directory
│   ├── index.js          # Bot entry point; handles loading commands, prefix commands, events, and login
│   ├── config.json       # Server-specific IDs and settings (e.g., channel IDs, role IDs, prefixes, badge configurations)
│   ├── emojis.json       # Centralized storage for all custom emoji Unicode escapes used by the bot
│   └── ...               # Additional directories for commands, events, handlers, etc.
└── ...                   # Other project files
```

## 🤝 Contributing

We welcome contributions from the community! If you're interested in improving TheSkull-Bot, please refer to our `Contributing.md` file for detailed guidelines on how to submit issues, propose features, and make pull requests.

*   Read our [Contributing Guidelines](./Contributing.md).

## 📄 License

This project is licensed under the "Other" license. For more details, please see the `LICENSE` file in the root of this repository.
