const { SlashCommandBuilder } = require('discord.js');
const figlet = require('figlet');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ascii')
        .setDescription('Convert text into an ASCII banner')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to convert')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('font')
                .setDescription('Choose a style')
                .addChoices(
                    { name: 'Standard', value: 'Standard' },
                    { name: 'Slant', value: 'Slant' },
                    { name: 'Doom', value: 'Doom' },
                    { name: 'Ghost', value: 'Ghost' },
                    { name: 'Big', value: 'Big' }
                )),

    async execute(interaction) {
        const text = interaction.options.getString('text');
        const font = interaction.options.getString('font') || 'Standard';

        if (text.length > 12) {
            return interaction.reply({ content: 'Keep it under 12 characters for these fonts!', ephemeral: true });
        }

        figlet(text, { font: font }, (err, data) => {
            if (err) return interaction.reply('Error generating art.');
            interaction.reply(`\`\`\`\n${data}\n\`\`\``);
        });
    },
};

