import { ActionRowBuilder, EmbedBuilder } from 'discord.js';
import config from './config.js';
import schedule from 'node-schedule';
import moment from 'moment';
import { loggingModel } from './mongo/mongo-schemas.js';
import {modalIds, modals} from './modals.js';

export default class Utils {
    constructor() {}

    static PreviousSong = undefined;

    static CurSongInfo = {
        name: "",
        duration: 0,
        startTime: undefined,
        isWorkaround: false,
        isSkip: false
    };
    
    static OriginalCountdownList = [];

    static LogType_INFO = "INFO";
    static LogType_ERROR = "ERROR";
    static LogType_DEBUG = "DEBUG";

    static Reminder_Frequency_Single = 0;
    static Reminder_Frequency_Daily = 1;
    static Reminder_Frequency_Weekly = 2;

    // TODO: Delete when '1 minute voiceconnection' issue fixed
    static VoiceConnection = undefined;

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
        let time = moment().add(minutes, "minutes").toDate();

        schedule.scheduleJob(name, time, func);
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
            content: " ",
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
        let momentTime = moment(currentTime).format("DD/MM/YYYY HH:mm:ss Z");

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

    static IsShowModal = (modalId) => {
        return modalIds.includes(`${modalId}-modal`);
    }

    static ShowModal = (interaction) => {
        switch (interaction.customId)
        {
            case "create-tier-list":
                interaction.showModal(modals.createTierListModal);
                break;
            case "create-countdown":
                interaction.showModal(modals.countdownModal);
                break;
            case "update-countdown":
                let updateCDModal = modals.updateCountdownModal;
                const userOriCD = this.OriginalCountdownList.find(x => x.userId === interaction.user.id);

                // 45 chars max
                let title = `Update ${userOriCD.name} Countdown`;
                if (title.length > 45)
                {
                    title = "Update Countdown";
                }
                updateCDModal.setTitle(title);

                updateCDModal.components[0].components[0].data.placeholder = updateCDModal.components[0].components[0].data.value = userOriCD.date;
                updateCDModal.components[1].components[0].data.placeholder = updateCDModal.components[1].components[0].data.value = userOriCD.description;
                updateCDModal.components[2].components[0].data.placeholder = updateCDModal.components[2].components[0].data.value = userOriCD.image;
                updateCDModal.components[3].components[0].data.placeholder = updateCDModal.components[3].components[0].data.value = userOriCD.url;

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

                cdObj.momentDate = moment(cdObj.date, "DD/MM/YYYY");

                return cdObj;
            case "update-countdown":
                const oriCDIndex = this.OriginalCountdownList.findIndex(x => x.userId === interaction.user.id);
                const oriCD = this.OriginalCountdownList[oriCDIndex];

                let updateCDObj = {
                    index: oriCDIndex,
                    name: oriCD.name,
                    date: interaction.fields.getTextInputValue("countdown-date"),
                    desc: interaction.fields.getTextInputValue("countdown-description"),
                    image: interaction.fields.getTextInputValue("countdown-image"),
                    url: interaction.fields.getTextInputValue("countdown-url")
                };

                updateCDObj.momentDate = moment(updateCDObj.date, "DD/MM/YYYY");

                return updateCDObj;
            default:
                break;
        }
    }
}