import { ModalBuilder, TextInputBuilder } from '@discordjs/builders';

const createTierListModal = new ModalBuilder()
    .setCustomId('create-tier-list-modal')
    .setTitle("Tier List Creator")
    .addComponents(
        new TextInputBuilder()
        .setCustomId('tier-list-name')
        .setLabel('Tier List Name')
        .setPlaceholder('My Super Awesome Tier List')
        .setStyle('Short')
        .setRequired(true),
        new TextInputBuilder()
        .setCustomId('tier-1-list')
        .setLabel('Tier 1')
        .setPlaceholder('TierName: item1, item2, etc')
        .setStyle('Paragraph'),
        new TextInputBuilder()
        .setCustomId('tier-2-list')
        .setLabel('Tier 2')
        .setPlaceholder('TierName: item1, item2, etc')
        .setStyle('Paragraph'),
        new TextInputBuilder()
        .setCustomId('tier-3-list')
        .setLabel('Tier 3')
        .setPlaceholder('TierName: item1, item2, etc')
        .setStyle('Paragraph'),
        new TextInputBuilder()
        .setCustomId('tier-4-list')
        .setLabel('Tier 4')
        .setPlaceholder('TierName: item1, item2, etc')
        .setStyle('Paragraph')
    );

const countdownModal = new ModalBuilder()
    .setCustomId('create-countdown-modal')
    .setTitle("Countdown Creator")
    .addComponents(
        new TextInputBuilder()
        .setCustomId('countdown-name')
        .setLabel('Countdown Name')
        .setPlaceholder('The hit TV Series Bimpson')
        .setStyle('Short')
        .setRequired(true),
        new TextInputBuilder()
        .setCustomId('countdown-date')
        .setLabel('Release Date')
        .setPlaceholder('DD/MM/YYYY')
        .setStyle('Short')
        .setRequired(true),
        new TextInputBuilder()
        .setCustomId('countdown-description')
        .setLabel('Description')
        .setPlaceholder('Bimpson is the best tv series')
        .setStyle('Short'),
        new TextInputBuilder()
        .setCustomId('countdown-image')
        .setLabel('Image URL')
        .setPlaceholder('https://image.com/something.png')
        .setStyle('Short'),
        new TextInputBuilder()
        .setCustomId('countdown-url')
        .setLabel('Countdown URL')
        .setPlaceholder('https://countdown-news.com')
        .setStyle('Short')
    );

export { createTierListModal, countdownModal };