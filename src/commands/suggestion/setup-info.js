const { ERROR, SUCCESS, SPARKLES, THUMBS_UP, THUMBS_DOWN, SHRUG } = require('../../emojis');
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-info')
        .setDescription('Post suggestion instructions')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(o => o.setName('channel').setDescription('Channel to post in').setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.editReply({ content: `${ERROR} Admin only` });
        }

        const channel = interaction.options.getChannel('channel');
        const embed = new EmbedBuilder()
            .setColor(0x00AAFF)
            .setTitle(`${SPARKLES} Got a suggestion?`)
            .setDescription(`Use </suggest:1535984934181806106> to submit one.`)
            .addFields(
                { name: 'How it works', value: `1. Post your suggestion\n2. Vote with ${THUMBS_UP}/${THUMBS_DOWN}/${SHRUG}\n3. Staff reviews it` },
                { name: 'Note', value: 'Duplicate or low-effort suggestions may be removed.' }
            )
            .setFooter({ text: 'Powered by TheSkull' });

        await channel.send({ embeds: [embed] });
        return interaction.editReply({ content: `${SUCCESS} Instructions posted in ${channel}!` });
    }
};