const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../emojis'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('base64')
        .setDescription('Encode or decode text in Base64')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text or Base64 string to process')
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
        const text = interaction.options.getString('text');
        const mode = interaction.options.getString('mode');
        
        let result;

        try {
            if (mode === 'encode') {
                result = Buffer.from(text, 'utf-8').toString('base64');
            } else {
                const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
                if (!base64Regex.test(text)) {
                    return interaction.reply({ 
                        content: `${config.ERROR} That doesn't look like a valid Base64 string.`, 
                        ephemeral: true 
                    });
                }
                result = Buffer.from(text, 'base64').toString('utf-8');
            }

            const embed = new EmbedBuilder()
                .setTitle(`${config.WRENCH} Base64 ${mode === 'encode' ? 'Encoder' : 'Decoder'}`)
                .setColor(0x00FF00)
                .addFields(
                    { name: 'Input', value: `\`${text}\`` },
                    { name: 'Result', value: `\`${result}\`` }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while processing your text.', ephemeral: true });
        }
    },
};
