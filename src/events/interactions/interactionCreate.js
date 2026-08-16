const { createTicket, claimTicket, promptCloseModal, closeTicket } = require('../../handlers/ticket');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        try {
            if (interaction.isChatInputCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command) return;
                await command.execute(interaction);
            }
            else if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_menu') {
                await createTicket(interaction);
            }
            else if (interaction.isButton()) {
                if (interaction.customId === 'ticket_claim') {
                    await claimTicket(interaction);
                }
                if (interaction.customId === 'ticket_close') {
                    await promptCloseModal(interaction);
                }
            }
            else if (interaction.isModalSubmit() && interaction.customId === 'close_modal') {
                await closeTicket(interaction);
            }
        } catch (err) {
            console.error('Interaction Error:', err);
        }
    }
};
