const { ERROR } = require('../../emojis');
const figlet = require('figlet');

const VALID_FONTS = ['Standard', 'Slant', 'Doom', 'Ghost', 'Big'];

module.exports = {
    name: 'ascii',
    async execute(message, args) {
        if (args.length === 0) {
            return message.reply(`${ERROR} Usage: \`x!ascii <text> [font]\` \u2014 fonts: Standard, Slant, Doom, Ghost, Big`);
        }

        let font = 'Standard';
        let textArgs = args;

        const lastArg = args[args.length - 1];
        const matchedFont = VALID_FONTS.find(f => f.toLowerCase() === lastArg.toLowerCase());
        if (matchedFont && args.length > 1) {
            font = matchedFont;
            textArgs = args.slice(0, -1);
        }

        const text = textArgs.join(' ');

        if (text.length > 12) {
            return message.reply(`${ERROR} Keep it under 12 characters for these fonts!`);
        }

        figlet(text, { font }, (err, data) => {
            if (err) return message.reply(`${ERROR} Error generating art.`);
            message.reply(`\`\`\`\n${data}\n\`\`\``);
        });
    }
};


