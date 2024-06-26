import { ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import { ActionRowBuilder } from 'discord.js';

const modalIds = ["create-countdown-modal", "update-countdown-modal"];

const GenerateCountdownModal = () => {
    return new ModalBuilder()
    .setCustomId(modalIds[0])
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
    );
}

const GenerateUpdateCountdownModal = () => {
    return new ModalBuilder()
    .setCustomId(modalIds[1])
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
    );
}

export { GenerateCountdownModal, GenerateUpdateCountdownModal, modalIds };