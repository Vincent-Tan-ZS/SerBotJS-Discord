import { ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import { ActionRowBuilder } from 'discord.js';

const modals = {
    createTierListModal: new ModalBuilder()
    .setCustomId('create-tier-list-modal')
    .setTitle("Tier List Creator")
    .addComponents(
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId('tier-list-name')
            .setLabel('Tier List Name')
            .setPlaceholder('My Super Awesome Tier List')
            .setStyle('Short')
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId('tier-1-list')
            .setLabel('Tier 1')
            .setPlaceholder('TierName: item1, item2, etc')
            .setStyle('Paragraph')
            .setRequired(false)
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId('tier-2-list')
            .setLabel('Tier 2')
            .setPlaceholder('TierName: item1, item2, etc')
            .setStyle('Paragraph')
            .setRequired(false)
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId('tier-3-list')
            .setLabel('Tier 3')
            .setPlaceholder('TierName: item1, item2, etc')
            .setStyle('Paragraph')
            .setRequired(false)
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId('tier-4-list')
            .setLabel('Tier 4')
            .setPlaceholder('TierName: item1, item2, etc')
            .setStyle('Paragraph')
            .setRequired(false)
        )
    ),
    countdownModal: new ModalBuilder()
    .setCustomId('create-countdown-modal')
    .setTitle("Countdown Creator")
    .addComponents(
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId('countdown-name')
            .setLabel('Countdown Name')
            .setPlaceholder('The hit TV Series Bimpson')
            .setStyle('Short')
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId('countdown-date')
            .setLabel('Release Date')
            .setPlaceholder('DD/MM/YYYY')
            .setStyle('Short')
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId('countdown-description')
            .setLabel('Description')
            .setPlaceholder('Bimpson is the best tv series')
            .setStyle('Short')
            .setRequired(false)
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId('countdown-image')
            .setLabel('Image URL')
            .setPlaceholder('https://image.com/something.png')
            .setStyle('Short')
            .setRequired(false)
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId('countdown-url')
            .setLabel('Countdown URL')
            .setPlaceholder('https://countdown-news.com')
            .setStyle('Short')
            .setRequired(false)
        )
    ),
    updateCountdownModal: new ModalBuilder()
    .setCustomId('update-countdown-modal')
    .setTitle("Countdown Updater")
    .addComponents(
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId('countdown-date')
            .setLabel('Release Date')
            .setStyle('Short')
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId('countdown-description')
            .setLabel('Description')
            .setStyle('Short')
            .setRequired(false)
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId('countdown-image')
            .setLabel('Image URL')
            .setStyle('Short')
            .setRequired(false)
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId('countdown-url')
            .setLabel('Countdown URL')
            .setStyle('Short')
            .setRequired(false)
        )
    ),
}

const modalIds = Object.values(modals).map(x => x.data.custom_id);

export { modals, modalIds };