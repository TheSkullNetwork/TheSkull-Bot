const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../emojis');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hex')
        .setDescription('Encode or decode text in Hexadecimal')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text or hex string to process')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('mode')
                .setDescription('Choose to encode or decode')
                .setRequired(true)
                .addChoices(
                    { name: 'Encode', value: 'encode' },
                    { name: 'Decode', value: 'decode' }
                )),

    async execute(interaction) {
        const input = interaction.options.getString('text');
        const mode = interaction.options.getString('mode');
        let result;

        try {
            if (mode === 'encode') {
                result = Buffer.from(input, 'utf-8').toString('hex');
            } else {
                if (!/^[0-9a-fA-F]+$/.test(input) || input.length % 2 !== 0) {
                    return interaction.reply({ 
                        content: `${config.ERROR} Invalid Hex string. Ensure it only contains characters 0-9 and a-f, and has an even length.`, 
                        ephemeral: true 
                    });
                }
                result = Buffer.from(input, 'hex').toString('utf-8');
            }

            const embed = new EmbedBuilder()
                .setTitle(`${config.PALETTE} Hex ${mode === 'encode' ? 'Encoder' : 'Decoder'}`)
                .setColor(0x0099FF)
                .addFields(
                    { name: 'Input', value: `\`${input}\`` },
                    { name: 'Result', value: `\`${result}\`` }
                );

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while processing.', ephemeral: true });
        }
    },
};
