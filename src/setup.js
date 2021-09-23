const Discord = require('discord.js'),
    EventManager = require('./events.js'),
    Commands = require('./commands.js'),
    DisTube = require('distube'),
    Handlers = require('./handlers.js'),
    client = new Discord.Client(),
    config = require('../config.json')

config.token = process.env.SERBOTJS_BOT_TOKEN;

const distube = new DisTube(client, { searchSongs: false, emitNewSongOnly: false, leaveOnStop: false });

//#region Distube EventListener
distube.on('playSong', (message, queue, song) => {
        let embed = new Discord.MessageEmbed()
            .setTitle('Now Playing')
            .setColor(config.embedColor)
            .setDescription(song.name);
        message.channel.send(embed);
        console.log(`[Distube] Playing ${song.name}`);
    })
    .on('initQueue', queue => {
        queue.autoplay = false;
        queue.volume = 100;
    })
    .on('error', (message, e) => {
        message.channel.send(`Error: ${e}`);
    })
    //#endregion Distube EventListener

//#region Discord Client EventListeners
client.on('ready', () => {
    console.log("SerBot is now online!");
    client.voice.connections.forEach((vc) => {
        vc.voice.setDeaf(true);
    })
})

client.on('voiceStateUpdate', (oldState, newState) => {
        if (!oldState.selfDeaf) newState.setSelfDeaf(true);
    })
    //#endregion Discord Client EventListeners

//#region Message Listener
client.on('message', (message) => {
        let msgContent = message.content;

        if (!msgContent.startsWith(`${config.prefix} `)) return;

        let messageArray = msgContent.split(' ').slice(1, msgContent.split(' ').length);
        let messageCommands = messageArray.length > 1 ? messageArray : messageArray[0];

        if (typeof(messageCommands) == 'string') {
            if (EventManager.messageIsCommandLowerCased(Commands.helpCommands, messageCommands)) {
                EventManager.sendCommandList(message);
            } else if (EventManager.messageIsCommandLowerCased(Commands.greetingCommands, messageCommands)) {
                EventManager.sendGreeting(message);
            } else if (EventManager.messageIsMusicAction(messageCommands)) {
                let channelId = message.member.voice.channelID;
                let voiceConnection = client.voice.connections.find(x => x.channel.id == channelId) || null;

                EventManager.musicAction(voiceConnection, message, messageCommands);
            } else if (EventManager.messageIsAdmin(Commands.disconnectCommands, message)) {
                message.channel.send("Logging out...")
                    .then(message => client.destroy())
                    .catch(console.error);
            }
        } else {
            if (EventManager.messageIsCommandArray(Commands.musicPlayCommands, messageCommands)) {
                EventManager.playMusic(message, messageCommands);
            } else if (EventManager.messageIsCommandArray(Commands.musicRemoveCommands, messageCommands)) {
                EventManager.removeMusic(message, messageCommands);
            } else if (EventManager.messageIsCommandArray(Commands.r6Commands, messageCommands)) {
                EventManager.retrieveR6Stats(messageCommands, message.channel);
            } else if (EventManager.messageIsCommandArray(Commands.localMusicCommands, messageCommands)) {
                EventManager.playLocalMusic(message, messageCommands);
            } else if (EventManager.messageIsCommandArray(Commands.covidCommands, messageCommands)) {
                EventManager.getCovidCases(message, messageCommands);
            } else if (EventManager.messageIsCommandArray(Commands.musicFilterCommands, messageCommands)) {
                EventManager.setQueueFilter(message, messageCommands)
            }
        }
    })
    //#endregion Message Listener

exports.Discord = Discord;
exports.Commands = Commands;
exports.Handlers = Handlers;
exports.client = client;
exports.config = config;
exports.distube = distube;