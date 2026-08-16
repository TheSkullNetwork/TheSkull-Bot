const { ERROR, PALETTE } = require('../../emojis');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'hex',
    async execute(message, args) {
        const mode = (args[0] || '').toLowerCase();
        const input = args.slice(1).join(' ');

        if (!['encode', 'decode'].includes(mode) || !input) {
            return message.reply(`${ERROR} Usage: \`x!hex <encode|decode> <text>\``);
        }

        let result;
        try {
            if (mode === 'encode') {
                result = Buffer.from(input, 'utf-8').toString('hex');
            } else {
                if (!/^[0-9a-fA-F]+$/.test(input) || input.length % 2 !== 0) {
                    return message.reply(`${ERROR} Invalid Hex string. Ensure it only contains characters 0-9 and a-f, and has an even length.`);
                }
                result = Buffer.from(input, 'hex').toString('utf-8');
            }

            const embed = new EmbedBuilder()
                .setTitle(`${PALETTE} Hex ${mode === 'encode' ? 'Encoder' : 'Decoder'}`)
                .setColor(0x0099FF)
                .addFields(
                    { name: 'Input', value: `\`${input}\`` },
                    { name: 'Result', value: `\`${result}\`` }
                );

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply(`${ERROR} An error occurred while processing.`);
        }
    }
};


