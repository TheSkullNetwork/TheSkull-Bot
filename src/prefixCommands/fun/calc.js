const { ERROR, SUCCESS } = require('../../emojis');
const { EmbedBuilder } = require('discord.js');
const { evaluate } = require('mathjs');

module.exports = {
    name: 'calc',
    async execute(message, args) {
        const expression = args.join(' ');
        if (!expression) {
            return message.reply(`${ERROR} Usage: \`x!calc <expression>\` (e.g. \`x!calc 2 + 2\`)`);
        }

        try {
            const result = evaluate(expression);

            const embed = new EmbedBuilder()
                .setTitle(`${SUCCESS} Calculator`)
                .setColor(0x3498DB)
                .addFields(
                    { name: 'Expression', value: `\`${expression}\`` },
                    { name: 'Result', value: `\`${result}\`` }
                );

            await message.reply({ embeds: [embed] });
        } catch (error) {
            message.reply(`${ERROR} Invalid expression. Please check your math syntax.`);
        }
    }
};


