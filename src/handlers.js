import Discord from 'discord.js';
import config from './config.js';

export default class Handlers {
    constructor() {}

    static createBasicEmbed(title, description) {
        return new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(config.embedColor)
            .setDescription(description);
    }

    static createErrorEmbed(title, description) {
        return new Discord.MessageEmbed()
            .setTitle(`Error: ${title}`)
            .setColor(config.embedColor)
            .setDescription(description);
    }
}