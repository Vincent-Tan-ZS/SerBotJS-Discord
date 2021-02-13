require('dotenv').config();

var http = require('http')

http.createServer(function(request, response) {}).listen(process.env.PORT)

const Discord = require('discord.js'),
    EventManager = require('./events.js'),
    Commands = require('./commands.js'),
    DisTube = require('distube'),
    client = new Discord.Client(),
    config = {
        prefix: "ser",
        token: process.env.SERBOTJS_BOT_TOKEN,
        embedColor: '#11116B',
        embedPauseIconURL: 'https://p7.hiclipart.com/preview/362/566/476/creative-commons-license-public-domain-wikimedia-commons-pause-icon.jpg'
    };

var voiceConnection = null;
const distube = new DisTube(client, { searchSongs: false, emitNewSongOnly: false, leaveOnStop: false });

// Distube Event Listeners
distube.on('playSong', (message, queue, song) => {
        let embed = new Discord.MessageEmbed()
            .setTitle('Now Playing')
            .setColor(config.embedColor)
            .setDescription(song.name);
        message.channel.send(embed);
    })
    .on('initQueue', queue => {
        queue.autoplay = false;
        queue.volume = 100;
    })
    .on('error', (message, e) => {
        message.channel.send(`Error: ${e}`);
    })

// Discord Client Events Listeners
client.on('ready', () => {
    console.log("SerBot is now online!");
    client.voice.connections.forEach((vc) => {
        vc.voice.setDeaf(true);
    })
})

client.on('voiceStateUpdate', (oldState, newState) => {
    newState.setSelfDeaf(true);
    voiceConnection = newState.connection;
})

client.on('message', (message) => {
    let msgContent = message.content;

    if (!msgContent.startsWith(`${config.prefix} `)) return;

    let messageArray = msgContent.split(' ').slice(1, msgContent.split(' ').length);
    let messageCommands = messageArray.length > 1 ? messageArray : messageArray[0];

    if (typeof(messageCommands) == 'string') {
        if (EventManager.messageIsCommandLowerCased(Commands.helpCommands, messageCommands)) {
            EventManager.sendCommandList(Discord, Commands, config, message);
        } else if (EventManager.messageIsCommandLowerCased(Commands.greetingCommands, messageCommands)) {
            EventManager.sendGreeting(message);
        } else if (EventManager.messageIsMusicAction(Commands, messageCommands)) {
            EventManager.musicAction(distube, Discord, config, voiceConnection, message, messageCommands);
        } else if (EventManager.messageIsAdmin(Commands.disconnectCommands, Discord, message)) {
            message.channel.send("Logging out...")
                .then(message => client.destroy())
                .catch(console.error);
        }
    } else {
        if (EventManager.messageIsCommandArray(Commands.musicPlayCommands, messageCommands)) {
            EventManager.playMusic(distube, Discord, config, message, messageCommands);
        } else if (EventManager.messageIsCommandArray(Commands.musicRemoveCommands, messageCommands)) {
            EventManager.removeMusic(distube, Discord, config, message, messageCommands);
        } else if (EventManager.messageIsCommandArray(Commands.r6Commands, messageCommands)) {
            EventManager.retrieveR6Stats(Discord, config, messageCommands, message.channel);
        }
    }
})

client.login(config.token);