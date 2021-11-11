import Discord from 'discord.js';
import { MessageActionRow } from 'discord.js';
import config from './config.js';

export default class Utils {
    constructor() {}

    static async sleep(ms) {
      await new Promise(function(resolve) {
        setTimeout(resolve, ms);
      });

      return;
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
        components = new MessageActionRow(),
    }) {
        if (isError) {
            title = `Error: ${title}`;
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(embedColor)
            .setDescription(description);

        if (embedURL.length > 0) {
            embed.setURL(embedURL);
        }

        if (embedImage.length > 0) {
            embed.setImage(embedImage);
        }

        if (author.length > 0) {
            embed.setAuthor(author, authorIcon, authorURL);
        }

        if (footer.length > 0) {
            embed.setFooter(footer, footerIcon);
        }

        if (thumbnail.length > 0) {
            embed.setThumbnail(thumbnail);
        }

        if (fields.length > 0) {
            fields.forEach(field => {
                let inline = field.inline != undefined ?
                    field.inline :
                    false;

                embed.addField(field.name, field.value, inline);
            });
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
        components = new MessageActionRow(),
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
}