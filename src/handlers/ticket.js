const { LOCK, SUCCESS, SKULL, UNLOCK, SHIELD, PIN, BOOK, ERROR } = require('../emojis');
const {
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    EmbedBuilder, MessageFlags, ModalBuilder,
    TextInputBuilder, TextInputStyle
} = require('discord.js');
const { STAFF_ROLE_ID, TICKET_LOG_CHANNEL_ID } = require('../config');

const claimedTickets = new Map();

async function createTicket(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const selected = interaction.values[0];
    const channel = await interaction.guild.channels.create({
        name: `ticket-${selected}-${interaction.user.username}`,
        permissionOverwrites: [
            { id: interaction.guild.id, deny: ['ViewChannel'] },
            { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages'] },
            { id: STAFF_ROLE_ID, allow: ['ViewChannel', 'SendMessages'] }
        ],
    });

    claimedTickets.set(channel.id, { creator: interaction.user.tag, claimedBy: 'None' });

    const welcomeEmbed = new EmbedBuilder()
        .setTitle(`${SKULL} Inquiry`)
        .setColor('#00ffcc')
        .setDescription(`Welcome, ${interaction.user}. Your dedicated support thread has been securely provisioned.\n\nOur <@&${STAFF_ROLE_ID}> department team has been alerted and will arrive to assist directly shortly.`)
        .addFields(
            { name: 'Opened By', value: `${interaction.user}`, inline: true },
            { name: 'Inquiry Subject', value: `\`${selected}\``, inline: true }
        )
        .setFooter({ text: `Clearance Requirement: Staff validation to close. \u2014 Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` });

    const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('ticket_claim').setLabel('Claim').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('ticket_close').setLabel(`${LOCK} Close Session`).setStyle(ButtonStyle.Danger)
    );

    await channel.send({ content: `<@&${STAFF_ROLE_ID}>`, embeds: [welcomeEmbed], components: [buttons] });
    await interaction.editReply({ content: `${SUCCESS} Ticket created: ${channel}` });
}

async function claimTicket(interaction) {
    if (!interaction.member.permissions.has('ManageMessages'))
        return interaction.reply({ content: 'Only staff can claim!', flags: MessageFlags.Ephemeral });
    const data = claimedTickets.get(interaction.channel.id) || { creator: 'Unknown' };
    claimedTickets.set(interaction.channel.id, { ...data, claimedBy: interaction.user.tag });
    await interaction.reply({ content: `${LOCK} Ticket claimed by ${interaction.user}` });
}

async function promptCloseModal(interaction) {
    if (!interaction.member.permissions.has('ManageMessages'))
        return interaction.reply({ content: 'Only staff can close!', flags: MessageFlags.Ephemeral });
    const modal = new ModalBuilder().setCustomId('close_modal').setTitle('Close Ticket Session');
    modal.addComponents(new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId('reason').setLabel('Reason for closing').setStyle(TextInputStyle.Paragraph).setRequired(true)
    ));
    await interaction.showModal(modal);
}

async function closeTicket(interaction) {
    try {
        const reason = interaction.fields.getTextInputValue('reason');
        const data = claimedTickets.get(interaction.channel.id) || { creator: 'Unknown', claimedBy: 'None' };
        const logChannel = interaction.guild.channels.cache.get(TICKET_LOG_CHANNEL_ID);

        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setTitle(`${SKULL} Skull Security: Grim Inquiry Log`)
                .setColor('#000000')
                .addFields(
                    { name: `${PIN} Ticket Identifier`, value: `\`${interaction.channel.name}\``, inline: false },
                    { name: `${UNLOCK} Opened By`, value: `${data.creator}`, inline: true },
                    { name: `${SHIELD} Claimed By`, value: `${data.claimedBy}`, inline: true },
                    { name: `${LOCK} Closed By`, value: `${interaction.user.tag}`, inline: true },
                    { name: `${BOOK} Closure Reason`, value: `${reason}`, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'Skull Security Protocol \u2014 Session Finalized' });

            await logChannel.send({ embeds: [logEmbed] });
        }

        claimedTickets.delete(interaction.channel.id);
        await interaction.channel.delete();
    } catch (err) {
        console.error('Ticket close error:', err);
        if (interaction.deferred || interaction.replied) {
            await interaction.followUp({ content: `${ERROR} An error occurred while closing the ticket.`, flags: MessageFlags.Ephemeral });
        }
    }
}

module.exports = { createTicket, claimTicket, promptCloseModal, closeTicket };
