import { Modal, TextInputComponent, SelectMenuComponent } from 'discord-modals';

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

export { createTierListModal };