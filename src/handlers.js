const serbot = require('./setup');

class Handlers {
    constructor() {}

    static createBasicEmbed(title, description) {
        return new serbot.Discord.MessageEmbed()
            .setTitle(title)
            .setColor(serbot.config.embedColor)
            .setDescription(description);
    }

    static createErrorEmbed(title, description) {
        return new serbot.Discord.MessageEmbed()
            .setTitle(`Error: ${title}`)
            .setColor(serbot.config.embedColor)
            .setDescription(description);
    }
}

module.exports = Handlers