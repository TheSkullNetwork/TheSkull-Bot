const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { create, all } = require('mathjs');
const { ERROR, SUCCESS } = require('../../emojis');

const math = create(all);
math.import({
    pow: (a, b) => {
        if (!Number.isFinite(b) || Math.abs(b) > 1000) throw new Error('exponent out of range');
        const r = Math.pow(a, b);
        if (!Number.isFinite(r)) throw new Error('result too large');
        return r;
    }
}, { override: true, wrap: false });

const MAX_LENGTH = 100;
const ALLOWED = /^[0-9+\-*/().,%^\s]+$/;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calc')
        .setDescription('Calculate a math expression')
        .addStringOption(option =>
            option.setName('expression')
                .setDescription('The math expression to evaluate')
                .setRequired(true)
                .setMaxLength(MAX_LENGTH)),

    async execute(interaction) {
        const expression = interaction.options.getString('expression');

        if (!ALLOWED.test(expression)) {
            return interaction.reply({
                content: `${ERROR} Only basic arithmetic is allowed: numbers and \`+ - * / ( ) . , % ^\``,
                ephemeral: true,
            });
        }

        try {
            const result = math.evaluate(expression);

            if (typeof result !== 'number' || !Number.isFinite(result)) {
                throw new Error('invalid result');
            }

            const embed = new EmbedBuilder()
                .setTitle(`${SUCCESS} Calculator`)
                .setColor(0x00FF00)
                .addFields(
                    { name: 'Expression', value: `\`${expression}\`` },
                    { name: 'Result', value: `\`${math.format(result, { precision: 14 })}\`` }
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
