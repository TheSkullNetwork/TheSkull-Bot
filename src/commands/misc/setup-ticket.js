const { SHIELD, WRENCH, HAMMER, PALETTE, CROSSED_SWORDS, BAN, GEAR, SUCCESS } = require('../../emojis');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-ticket')
        .setDescription('Sets up the ticket system')
        .addChannelOption(option => 
            option.setName('channel')
            .setDescription('Channel for the panel')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)),

    async execute(interaction) {
        const targetChannel = interaction.options.getChannel('channel');
        const embed = new EmbedBuilder()
            .setTitle(`${SHIELD} The Skull Ticket System`)
            .setDescription(
                "Welcome to our support center. Please select the category that best matches your request from the menu below so we can direct you to the right team.\n\n" +
                "**Available Categories:**\n" +
                `${SHIELD} **Staff:** Apply for a position on our moderation team.\n` +
                "\u2014 **Unban/Unmute:** Appeal a previous server action.\n" +
                `${WRENCH} **General Support:** General questions or help.\n` +
                "\u2014 **Creative:** Roles for artists, singers, and creators.\n" +
                `${CROSSED_SWORDS} **Teams:** Join the Red, Blue, or Purple competitive teams.\n` +
                "\u2014 **Developer:** Apply for verified developer status."
            )
            .setColor('Blue')
            .setFooter({ text: 'Ticket Support | The Skull' });

        const menu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('ticket_menu')
                .setPlaceholder('Select ticket type...')
                .addOptions([
                    new StringSelectMenuOptionBuilder().setLabel('Staff Apply').setValue('staff').setEmoji(SHIELD),
                    new StringSelectMenuOptionBuilder().setLabel('Unban/Unmute Request').setValue('unban').setEmoji(HAMMER),
                    new StringSelectMenuOptionBuilder().setLabel('General Support').setValue('support').setEmoji(WRENCH),
                    new StringSelectMenuOptionBuilder().setLabel('Creative Role').setValue('creative').setEmoji(PALETTE),
                    new StringSelectMenuOptionBuilder().setLabel('Red/Blue/Purple Team').setValue('teams').setEmoji(CROSSED_SWORDS),
                    new StringSelectMenuOptionBuilder().setLabel('Verified Developer').setValue('dev').setEmoji(GEAR)
                ])
        );

        await targetChannel.send({ embeds: [embed], components: [menu] });
        await interaction.reply({ content: `${SUCCESS} Panel sent to ${targetChannel}!`, ephemeral: true });
    },
};
