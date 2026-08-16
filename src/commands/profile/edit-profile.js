const { SUCCESS, ERROR } = require('../../emojis');
const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { profiles } = require('../../database/database.js');

const FIELDS = ['bio', 'city', 'pronouns', 'timezone', 'age', 'skills', 'portfolio', 'github'];
const URL_FIELDS = ['portfolio', 'github'];

function isValidUrl(value) {
    return /^https?:\/\/.+/i.test(value);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edit-profile')
        .setDescription('Edit your profile (all fields optional)')
        .addStringOption(o => o.setName('bio').setDescription('A short bio'))
        .addStringOption(o => o.setName('city').setDescription('Your city'))
        .addStringOption(o => o.setName('pronouns').setDescription('Your pronouns'))
        .addStringOption(o => o.setName('timezone').setDescription('Your timezone'))
        .addStringOption(o => o.setName('age').setDescription('Your age'))
        .addStringOption(o => o.setName('skills').setDescription('Your skills'))
        .addStringOption(o => o.setName('portfolio').setDescription('Link to your portfolio (https://...)'))
        .addStringOption(o => o.setName('github').setDescription('Link to your GitHub (https://...)')),

    async execute(interaction) {
        const updated = [];

        for (const field of URL_FIELDS) {
            const value = interaction.options.getString(field);
            if (value !== null && !isValidUrl(value)) {
                return interaction.reply({
                    content: `${ERROR} \`${field}\` needs to be a valid link starting with \`https://\`.`,
                    flags: MessageFlags.Ephemeral,
                });
            }
        }

        for (const field of FIELDS) {
            const value = interaction.options.getString(field);
            if (value !== null) {
                profiles.update(interaction.user.id, field, value);
                updated.push(field);
            }
        }

        if (!updated.length) {
            return interaction.reply({
                content: `${ERROR} You didn't provide any fields to update.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        await interaction.reply({
            content: `${SUCCESS} Updated: ${updated.join(', ')}`,
            flags: MessageFlags.Ephemeral,
        });
    }
};
