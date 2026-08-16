const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { evaluate } = require('mathjs');
const { ERROR, SUCCESS } = require('../../emojis');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calc')
        .setDescription('Calculate a math expression')
        .addStringOption(option =>
            option.setName('expression')
                .setDescription('The math expression to evaluate')
                .setRequired(true)),

    async execute(interaction) {
        const expression = interaction.options.getString('expression');

        try {
            const result = evaluate(expression);

            const embed = new EmbedBuilder()
                .setTitle(`${SUCCESS} Calculator`)
                .setColor(0x00FF00)
                .addFields(
                    { name: 'Expression', value: `\`${expression}\`` },
                    { name: 'Result', value: `\`${result}\`` }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({
                content: `${ERROR} Invalid expression. Please check your syntax and try again.`,
                ephemeral: true,
            });
        }
    },
};
