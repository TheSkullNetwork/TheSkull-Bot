const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { generateProfileCard } = require('../../handlers/profileCard');
const { buildProfileButtons } = require('../../handlers/profile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription("View your profile or someone else's")
        .addUserOption(o => o.setName('user').setDescription('Whose profile to view')),

    async execute(interaction) {
        await interaction.deferReply();
        const targetUser = interaction.options.getUser('user') || interaction.user;
        let member;
        try {
            member = await interaction.guild.members.fetch(targetUser.id);
        } catch {
            return interaction.editReply({ content: 'That user is not in this server anymore.' });
        }

        const buffer = await generateProfileCard(member);
        const attachment = new AttachmentBuilder(buffer, { name: 'profile.png' });
        const buttonRow = buildProfileButtons(member);

        const payload = { files: [attachment] };
        if (buttonRow) payload.components = [buttonRow];

        await interaction.editReply(payload);
    }
};