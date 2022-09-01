import { Modal, TextInputComponent } from 'discord-modals';

const createTierListModal = new Modal()
    .setCustomId('create-tier-list-modal')
    .setTitle("Tier List Creator")
    .addComponents(
        new TextInputComponent()
        .setCustomId('tier-list-name')
        .setLabel('Tier List Name')
        .setPlaceholder('My Super Awesome Tier List')
        .setStyle('SHORT')
        .setRequired(true),
        new TextInputComponent()
        .setCustomId('tier-1-list')
        .setLabel('Tier 1')
        .setPlaceholder('TierName: item1, item2, etc')
        .setStyle('LONG'),
        new TextInputComponent()
        .setCustomId('tier-2-list')
        .setLabel('Tier 2')
        .setPlaceholder('TierName: item1, item2, etc')
        .setStyle('LONG'),
        new TextInputComponent()
        .setCustomId('tier-3-list')
        .setLabel('Tier 3')
        .setPlaceholder('TierName: item1, item2, etc')
        .setStyle('LONG'),
        new TextInputComponent()
        .setCustomId('tier-4-list')
        .setLabel('Tier 4')
        .setPlaceholder('TierName: item1, item2, etc')
        .setStyle('LONG')
    );

const countdownModal = new Modal()
    .setCustomId('create-countdown-modal')
    .setTitle("Countdown Creator")
    .addComponents(
        new TextInputComponent()
        .setCustomId('countdown-name')
        .setLabel('Countdown Name')
        .setPlaceholder('The hit TV Series Bimpson')
        .setStyle('SHORT')
        .setRequired(true),
        new TextInputComponent()
        .setCustomId('countdown-date')
        .setLabel('Release Date')
        .setPlaceholder('')
        .setStyle('SHORT')
        .setRequired(true),
        new TextInputComponent()
        .setCustomId('countdown-description')
        .setLabel('Description')
        .setPlaceholder('Bimpson is the best tv series')
        .setStyle('SHORT'),
        new TextInputComponent()
        .setCustomId('countdown-image')
        .setLabel('Image URL')
        .setPlaceholder('https://image.com/something.png')
        .setStyle('SHORT'),
        new TextInputComponent()
        .setCustomId('countdown-url')
        .setLabel('Countdown URL')
        .setPlaceholder('https://countdown-news.com')
        .setStyle('SHORT')
    );

export { createTierListModal, countdownModal };