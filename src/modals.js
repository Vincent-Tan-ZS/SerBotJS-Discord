import { LabelBuilder, ModalBuilder, TextInputBuilder } from '@discordjs/builders';

const CreateCountdownModalId = "create-countdown-modal";
const UpdateCountdownModalId = "update-countdown-modal";

const modalIds = [CreateCountdownModalId, UpdateCountdownModalId];

const CreateCountdownModal = new ModalBuilder()
    .setCustomId(CreateCountdownModalId)
    .setTitle("Countdown Creator")
    .addLabelComponents(
        new LabelBuilder()
            .setLabel('Countdown Name')
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId('countdown-name')
                    .setPlaceholder('The hit TV Series Bimpson')
                    .setStyle('Short')
            ),
        new LabelBuilder()
            .setLabel('Release Date')
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId('countdown-date')
                    .setPlaceholder('DD/MM/YYYY')
                    .setStyle('Short')
            ),
        new LabelBuilder()
            .setLabel('Description')
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId('countdown-description')
                    .setPlaceholder('Bimpson is the best tv series')
                    .setStyle('Short')
                    .setRequired(false)
            ),
        new LabelBuilder()
            .setLabel('Image URL')
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId('countdown-image')
                    .setPlaceholder('https://image.com/something.png')
                    .setStyle('Short')
                    .setRequired(false)
            ),
        new LabelBuilder()
            .setLabel('Countdown URL')
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId('countdown-url')
                    .setPlaceholder('https://countdown-news.com')
                    .setStyle('Short')
                    .setRequired(false)
            ),
    );

const UpdateCountdownModal = new ModalBuilder()
    .setCustomId(UpdateCountdownModalId)
    .setTitle("Countdown Updater")
    .addLabelComponents(
        new LabelBuilder()
            .setLabel('Release Date')
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId('countdown-date')
                    .setStyle('Short')
            ),
        new LabelBuilder()
            .setLabel('Description')
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId('countdown-description')
                    .setStyle('Short')
                    .setRequired(false)
            ),
        new LabelBuilder()
            .setLabel('Image URL')
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId('countdown-image')
                    .setStyle('Short')
                    .setRequired(false)
            ),
        new LabelBuilder()
            .setLabel('Countdown URL')
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId('countdown-url')
                    .setStyle('Short')
                    .setRequired(false)
            ),
    );

export { CreateCountdownModal, UpdateCountdownModal, modalIds, CreateCountdownModalId, UpdateCountdownModalId };