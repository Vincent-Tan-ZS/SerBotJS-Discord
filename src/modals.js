import { LabelBuilder, ModalBuilder, TextInputBuilder } from '@discordjs/builders';

const ModalIds = {
    CreateCountdownModalId: "create-countdown-modal",
    UpdateCountdownModalId: "update-countdown-modal",
};

const CountdownInputIds = {
    Name: 'countdown-name',
    Date: 'countdown-date',
    Description: 'countdown-description',
    Image: 'countdown-image',
    Url: 'countdown-url'
};

const CreateCountdownModal = new ModalBuilder()
    .setCustomId(ModalIds.CreateCountdownModalId)
    .setTitle("Countdown Creator")
    .addLabelComponents(
        new LabelBuilder()
            .setLabel('Countdown Name')
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId(CountdownInputIds.Name)
                    .setPlaceholder('The hit TV Series Bimpson')
                    .setStyle('Short')
            ),
        new LabelBuilder()
            .setLabel('Release Date')
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId(CountdownInputIds.Date)
                    .setPlaceholder('DD/MM/YYYY')
                    .setStyle('Short')
            ),
        new LabelBuilder()
            .setLabel('Description')
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId(CountdownInputIds.Description)
                    .setPlaceholder('Bimpson is the best tv series')
                    .setStyle('Short')
                    .setRequired(false)
            ),
        new LabelBuilder()
            .setLabel('Image URL')
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId(CountdownInputIds.Image)
                    .setPlaceholder('https://image.com/something.png')
                    .setStyle('Short')
                    .setRequired(false)
            ),
        new LabelBuilder()
            .setLabel('Countdown URL')
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId(CountdownInputIds.Url)
                    .setPlaceholder('https://countdown-news.com')
                    .setStyle('Short')
                    .setRequired(false)
            ),
    );

const UpdateCountdownModal = new ModalBuilder()
    .setCustomId(ModalIds.UpdateCountdownModalId)
    .setTitle("Countdown Updater")
    .addLabelComponents(
        new LabelBuilder()
            .setLabel('Release Date')
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId(CountdownInputIds.Date)
                    .setStyle('Short')
            ),
        new LabelBuilder()
            .setLabel('Description')
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId(CountdownInputIds.Description)
                    .setStyle('Short')
                    .setRequired(false)
            ),
        new LabelBuilder()
            .setLabel('Image URL')
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId(CountdownInputIds.Image)
                    .setStyle('Short')
                    .setRequired(false)
            ),
        new LabelBuilder()
            .setLabel('Countdown URL')
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId(CountdownInputIds.Url)
                    .setStyle('Short')
                    .setRequired(false)
            ),
    );

export { CreateCountdownModal, UpdateCountdownModal, ModalIds, CountdownInputIds };