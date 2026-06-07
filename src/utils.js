import { ActionRowBuilder, EmbedBuilder } from 'discord.js';
import config from './config.js';
import schedule from 'node-schedule';
import { loggingModel } from './mongo/mongo-schemas.js';
import { CountdownInputIds, CreateCountdownModal, ModalIds, UpdateCountdownModal } from './modals.js';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
// import { riffy as Riffy } from "./setup.js";

dayjs.extend(customParseFormat);

export default class Utils {
    constructor() {}

    static PreviousSong = [];
    
    static OriginalCountdownList = [];

    static LogType_INFO = "INFO";
    static LogType_ERROR = "ERROR";
    static LogType_DEBUG = "DEBUG";

    static Reminder_Frequency_Single = 0;
    static Reminder_Frequency_Daily = 1;
    static Reminder_Frequency_Weekly = 2;

    static FeatureUpdate_Bot = "Bot";
    static FeatureUpdate_Site = "Site";

    static getRatio(numerator, denominator, percentage) {
        let num = parseFloat(numerator);
        let den = parseFloat(denominator);

        if (num == 0 || den == 0 || isNaN(num) || isNaN(den)) {
            return 0;
        }

        if (percentage) {
            return num / den * 100;
        }

        return num / den;
    }

    static cancelTimeout(name) {
        schedule.cancelJob(name);
    }

    static timeout(name, minutes, func) {
        let time = dayjs().add(minutes, "minutes").toDate();

        schedule.scheduleJob(name, time, func);
    }

    static GetGuildPrevSong(guildId) {
        const index = Utils.PreviousSong.findIndex(s => s.guildId === guildId);
        return index < 0 ? null : Utils.PreviousSong[index];
    }

    static createEmbed({
        isError = false,
        title = 'lorem ipsum',
        description = '',
        embedURL = '',
        embedImage = '',
        embedColor = config.embedColor,
        author = '',
        authorIcon = '',
        authorURL = '',
        footer = '',
        footerIcon = '',
        thumbnail = '',
        fields = new Array(),
        setTimestamp = false,
        timestampOverride = '',
        components = new ActionRowBuilder(),
    }) {
        if (isError) {
            title = `Error: ${title}`;
        }

        let embed = new EmbedBuilder()
            .setTitle(title)
            .setColor(embedColor);
        
        if (description.length > 0) {
            embed.setDescription(description);
        }

        if (embedURL.length > 0) {
            embed.setURL(embedURL);
        }

        if (embedImage.length > 0) {
            embed.setImage(embedImage);
        }

        if (author.length > 0) {
            let authorData = {
                name: author
            };

            if (authorURL.length > 0) {
                authorData.url = authorURL
            }

            if (authorIcon.length > 0) {
                authorData.iconURL = authorIcon;
            }

            embed.setAuthor(authorData);
        }

        if (footer.length > 0) {
            let footerData = {
                text: footer
            };

            if (footerIcon.length > 0) {
                footerData.iconURL = footerIcon;
            }

            embed.setFooter(footerData);
        }

        if (thumbnail.length > 0) {
            embed.setThumbnail(thumbnail);
        }

        if (fields.length > 0) {
            let fieldsData = fields.map(field => {
                let inline = field.inline ?? false;
                return { name: field.name, value: field.value, inline: inline };
            });

            embed.addFields(fieldsData);
        }

        if (setTimestamp) {
            if (timestampOverride) {
                embed.setTimestamp(timestampOverride);
            } else {
                embed.setTimestamp();
            }
        }

        let messageOption = {
            embeds: [embed]
        };

        if (components.components.length > 0) {
            messageOption.components = [components];
        }

        return messageOption;
    }

    static sendEmbed({
        message = undefined,
        channel = undefined,
        isEdit = false,
        isError = false,
        title = 'lorem ipsum',
        description = '',
        embedURL = '',
        embedImage = '',
        embedColor = config.embedColor,
        author = '',
        authorIcon = '',
        authorURL = '',
        footer = '',
        footerIcon = '',
        thumbnail = '',
        fields = new Array(),
        setTimestamp = false,
        timestampOverride = '',
        components = new ActionRowBuilder(),
    }) {
        if (message == undefined && channel == undefined) return;

        if (message != undefined) {
            channel = message.channel;
        }

        let embed = this.createEmbed({
            isError: isError,
            title: title,
            description: description,
            embedURL: embedURL,
            embedImage: embedImage,
            embedColor: embedColor,
            author: author,
            authorIcon: authorIcon,
            authorURL: authorURL,
            footer: footer,
            footerIcon: footerIcon,
            thumbnail: thumbnail,
            fields: fields,
            setTimestamp: setTimestamp,
            timestampOverride: timestampOverride,
            components: components,
        });

        if (isEdit && message != undefined) {
            message.edit(embed);
        } else {
            channel.send(embed);
        }
    }

    static getUserIdFromMention(discordMention) {
        let start = discordMention.FirstDigitIndex();
        let end = discordMention.lastIndexOf(">") - start;
        return discordMention.substr(start, end);
    }

    static Log = (logType, msg, type = "General") => {
        if (!this.IsLogTypeValid(logType)) return;
        
        let momentTime = dayjs(new Date()).format("DD/MM/YYYY HH:mm:ss Z");

        console.log(`[${momentTime}] [${type}] ${logType}: ${msg}`);

        if (logType !== this.LogType_DEBUG)
        {
            const newLog = new loggingModel({
                Type: type,
                LogType: logType,
                Message: msg
            });
            newLog.save();
        }
    }

    static BulkLog = async (logs) => {
        if (!logs?.length) return;

        const validLogs = logs.filter((l) => this.IsLogTypeValid(l?.logType));
        if (!validLogs.length) return;

        await loggingModel.saveLogs(validLogs);
    }

    static ArrComp = (arr1, arr2) => {
        return arr1.length === arr2.length && arr1.every((v, i) => arr2[i] === v);
    }

    static RandNum = (decimal = 2) => {
        let num = Number(Math.random().toFixed(decimal));
        if (num === 0) num = Math.pow(10, -decimal);
        return num;
    }

    static MaxRandNum = (max) => {
        return Math.floor((Math.random() * max) + 1) - 1;
    }

    static IsOwner = (user) => {
        return user.id === process.env.SERHOLMES_ID;
    }

    static IsValidURL = (str) => {
        try
        {
            new URL(str);
            return true;
        }
        catch (e)
        {
            return false;
        }
    }

    static IsShowModal = (modalId) => {
        return Object.values(ModalIds).includes(modalId);
    }

    static ShowModal = (interaction) => {
        switch (interaction.customId)
        {
            case ModalIds.CreateCountdownModalId:
                interaction.showModal(CreateCountdownModal);
                break;
            case ModalIds.UpdateCountdownModalId:
                let updateCDModal = UpdateCountdownModal;
                const userOriCD = this.OriginalCountdownList.find(x => x.userId === interaction.user.id);

                // 45 chars max
                let title = `Update ${userOriCD.name} Countdown`;
                if (title.length > 45)
                {
                    title = "Update Countdown";
                }

                const ProcessOptionalField = (fieldValue) => {
                    let placeholderField = fieldValue;

                    // 100 chars max
                    if (placeholderField.length > 100) {
                        placeholderField = placeholderField.substring(0, 99);
                    }

                    if (fieldValue.length <= 0) {
                        fieldValue = "\0";
                    }

                    return [placeholderField, fieldValue];
                }

                const [placeholderDescription, description] = ProcessOptionalField(userOriCD.description);
                const [placeholderImage, image] = ProcessOptionalField(userOriCD.image);
                const [placeholderUrl, url] = ProcessOptionalField(userOriCD.url);

                updateCDModal.setTitle(title);

                updateCDModal.components[0].data.component.setPlaceholder(userOriCD.date); 
                updateCDModal.components[0].data.component.setValue(userOriCD.date);
                
                updateCDModal.components[1].data.component.setPlaceholder(placeholderDescription);
                updateCDModal.components[1].data.component.setValue(description);

                updateCDModal.components[2].data.component.setPlaceholder(placeholderImage);
                updateCDModal.components[2].data.component.setValue(image);

                updateCDModal.components[3].data.component.setPlaceholder(placeholderUrl);
                updateCDModal.components[3].data.component.setValue(url);

                interaction.showModal(updateCDModal);
                break;
            default:
                return false;
        }
    }

    static ExtractModalValues = (interaction) => {
        switch (interaction.customId)
        {
            case ModalIds.CreateCountdownModalId:
                let cdObj = {
                    name: interaction.fields.getTextInputValue(CountdownInputIds.Name),
                    date: interaction.fields.getTextInputValue(CountdownInputIds.Date),
                    desc: interaction.fields.getTextInputValue(CountdownInputIds.Description),
                    image: interaction.fields.getTextInputValue(CountdownInputIds.Image),
                    url: interaction.fields.getTextInputValue(CountdownInputIds.Url)
                };

                cdObj.momentDate = dayjs(cdObj.date, "DD/MM/YYYY");

                return cdObj;
            case ModalIds.UpdateCountdownModalId:
                const oriCDIndex = this.OriginalCountdownList.findIndex(x => x.userId === interaction.user.id);
                const oriCD = this.OriginalCountdownList[oriCDIndex];

                let updateCDObj = {
                    index: oriCDIndex,
                    name: oriCD.name,
                    date: interaction.fields.getTextInputValue(CountdownInputIds.Date),
                    desc: interaction.fields.getTextInputValue(CountdownInputIds.Description).replace("\0", ""),
                    image: interaction.fields.getTextInputValue(CountdownInputIds.Image).replace("\0", ""),
                    url: interaction.fields.getTextInputValue(CountdownInputIds.Url).replace("\0", "")
                };

                updateCDObj.momentDate = dayjs(updateCDObj.date, "DD/MM/YYYY");

                return updateCDObj;
            default:
                break;
        }
    }

    static FixInProgressCheck = (message) => {
        if (this.IsOwner(message.author) !== true)
        {
            message.channel.send(`Sorry! This feature is currently unavailable and is being fixed!`);
            return false;
        }

        return true;
    }

    static NoMusicAllowed = (message) => {
        message.channel.send(`Youtube and other music streaming platforms have updated several things on their end, preventing bots from streaming music. If an alternative pops up in the future, I will look into it.`);
    }

    static DisconnectRiffyPlayer = (guildId) => {
        // if (Riffy.players.has(guildId) !== true) return;

        // const player = Riffy.players.get(guildId);
        // player.disconnect();
        // player.destroy();

        // Riffy.players.delete(guildId);
    } 

    static QueueFinishedTimer = (guildId) => {
        this.timeout(`leaveVC-${guildId}`, 5, () => {
            this.DisconnectRiffyPlayer(guildId);
        });
    }

    static MillisecondsToFormattedDuration = (ms) => {
        let minutes = Math.floor(ms / 60000);
        let seconds = ((ms % 60000) / 1000).toFixed(0);

        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    static NumberOfTimesAction(num, channel, elementAction)
    {
        const noOfTimes = isNaN(num) ? 1 : Number.parseInt(num);
        
        if (noOfTimes <= 0)
        {
            channel.send("What");
            return [];
        }

        if (noOfTimes > 10)
        {
            channel.send("Imma stop you right there chief, I'm limiting this to 10 max");
            return [];
        }
        
        let results = {};

        for (let i = 0; i < noOfTimes; ++i)
        {
            var elRes = elementAction();
            
            if (!results[elRes]) results[elRes] = 0;
            results[elRes]++;
        }

        return Object.entries(results);
    }

    static IsLogTypeValid(logType) {
        return logType === this.LogType_ERROR || logType === this.LogType_INFO || logType === this.LogType_DEBUG;
    }

    static CreateLog = (logType, msg, type = "General") => {
        let momentTime = dayjs(new Date()).format("DD/MM/YYYY HH:mm:ss Z");
        console.log(`[${momentTime}] [${type}] ${logType}: ${msg}`);
        return { logType, msg, type };
    }
}