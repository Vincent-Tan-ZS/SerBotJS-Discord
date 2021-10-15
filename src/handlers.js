import Discord from 'discord.js';
import config from './config.js';

export default class Handlers {
    constructor() {}

    static sendEmbed({
        message = undefined,
        channel = undefined,
        isEdit = false,
        isError = false,
        title = 'lorem ipsum',
        description = '',
        embedURL = '',
        embedImage = '',
        author = '',
        authorIcon = '',
        authorURL = '',
        footer = '',
        footerIcon = '',
        thumbnail = '',
        fields = new Array(),
        setTimestamp = false,
        timestampOverride = ''
    }) {
        if (message == undefined && channel == undefined) return;

        if (message != undefined) {
            channel = message.channel;
        }

        if (isError) {
            title = `Error: ${title}`;
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(config.embedColor)
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

        if (isEdit && message != undefined) {
            message.edit(messageOption);
        } else {
            channel.send(messageOption);
        }
    }

    static getUserIdFromMention(discordMention) {
        let start = discordMention.indexOf("!") + 1;
        let end = discordMention.lastIndexOf(">") - start;
        return discordMention.substr(start, end);
    }
}