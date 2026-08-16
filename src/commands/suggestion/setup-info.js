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
            .setTitle(`${SPARKLES} How to submit a suggestion`)
            .setDescription(`Use </suggest:1535984934181806106>\n\n1. It gets posted here.\n2. Vote with ${THUMBS_UP}/${THUMBS_DOWN}/${SHRUG}.\n3. Staff will review!`)
            .setColor(0x00AAFF)
            .setFooter({ text: 'Powered by TheSkull' });

        await channel.send({ embeds: [embed] });
        return interaction.editReply({ content: `${SUCCESS} Instructions posted in ${channel}!` });
    }
};