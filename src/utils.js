import { ActionRowBuilder, EmbedBuilder } from 'discord.js';
import config from './config.js';
import schedule from 'node-schedule';
import { loggingModel } from './mongo/mongo-schemas.js';
import {modalIds, GenerateCountdownModal, GenerateUpdateCountdownModal} from './modals.js';
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
        if (logType !== this.LogType_ERROR && logType !== this.LogType_INFO && logType !== this.LogType_DEBUG) return;

        let currentTime = new Date();
        let momentTime = dayjs(currentTime).format("DD/MM/YYYY HH:mm:ss Z");

        console.log(`[${momentTime}] [${type}] ${logType}: ${msg}`);

        if (logType !== this.LogType_DEBUG)
        {
            const newLog = new loggingModel({
                Timestamp: currentTime,
                Type: type,
                LogType: logType,
                Message: msg
            });
            newLog.save();
        }
    }

    static ArrComp = (arr1, arr2) => {
        return arr1.length === arr2.length && arr1.every((v, i) => arr2[i] === v);
    }

    static RandNum = (decimal = 2) => {
        const GenNum = () => {
            return Math.random().toFixed(decimal);
        }

        return Number(GenNum()) === 0
            ? 1
            : Number(GenNum());
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
        return modalIds.includes(`${modalId}-modal`);
    }

    static ShowModal = (interaction) => {
        switch (interaction.customId)
        {
            case "create-countdown":
                interaction.showModal(GenerateCountdownModal());
                break;
            case "update-countdown":
                let updateCDModal = GenerateUpdateCountdownModal();
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

                updateCDModal.components[0].components[0].setPlaceholder(userOriCD.date); 
                updateCDModal.components[0].components[0].setValue(userOriCD.date);
                
                updateCDModal.components[1].components[0].setPlaceholder(placeholderDescription);
                updateCDModal.components[1].components[0].setValue(description);

                updateCDModal.components[2].components[0].setPlaceholder(placeholderImage);
                updateCDModal.components[2].components[0].setValue(image);

                updateCDModal.components[3].components[0].setPlaceholder(placeholderUrl);
                updateCDModal.components[3].components[0].setValue(url);

                interaction.showModal(updateCDModal);
                break;
            default:
                return false;
        }
    }

    static ExtractModalValues = (type, interaction) => {
        switch (type)
        {
            case "countdown":
                let cdObj = {
                    name: interaction.fields.getTextInputValue("countdown-name"),
                    date: interaction.fields.getTextInputValue("countdown-date"),
                    desc: interaction.fields.getTextInputValue("countdown-description"),
                    image: interaction.fields.getTextInputValue("countdown-image"),
                    url: interaction.fields.getTextInputValue("countdown-url")
                };

                cdObj.momentDate = dayjs(cdObj.date, "DD/MM/YYYY");

                return cdObj;
            case "update-countdown":
                const oriCDIndex = this.OriginalCountdownList.findIndex(x => x.userId === interaction.user.id);
                const oriCD = this.OriginalCountdownList[oriCDIndex];

                let updateCDObj = {
                    index: oriCDIndex,
                    name: oriCD.name,
                    date: interaction.fields.getTextInputValue("countdown-date"),
                    desc: interaction.fields.getTextInputValue("countdown-description").replace("\0", ""),
                    image: interaction.fields.getTextInputValue("countdown-image").replace("\0", ""),
                    url: interaction.fields.getTextInputValue("countdown-url").replace("\0", "")
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
        message.channel.send(`Youtube has updated several things on their end, preventing bots from streaming music. If an alternative pops up in the future, I will look into it. Thanks Youtube :)`);
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
}