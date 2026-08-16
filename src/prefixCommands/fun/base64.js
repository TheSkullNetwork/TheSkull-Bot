const { ERROR, WRENCH } = require('../../emojis');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'base64',
    async execute(message, args) {
        const mode = (args[0] || '').toLowerCase();
        const text = args.slice(1).join(' ');

        if (!['encode', 'decode'].includes(mode) || !text) {
            return message.reply(`${ERROR} Usage: \`x!base64 <encode|decode> <text>\``);
        }

        let result;
        try {
            if (mode === 'encode') {
                result = Buffer.from(text, 'utf-8').toString('base64');
            } else {
                const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
                if (!base64Regex.test(text)) {
                    return message.reply(`${ERROR} That doesn't look like a valid Base64 string.`);
                }
                result = Buffer.from(text, 'base64').toString('utf-8');
            }

            const embed = new EmbedBuilder()
                .setTitle(`${WRENCH} Base64 ${mode === 'encode' ? 'Encoder' : 'Decoder'}`)
                .setColor(0x00FF00)
                .addFields(
                    { name: 'Input', value: `\`${text}\`` },
                    { name: 'Result', value: `\`${result}\`` }
                )
                .setTimestamp();

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply(`${ERROR} An error occurred while processing your text.`);
        }
    }
};


