import Discord from 'discord.js';
import DisTube from 'distube';
import Handlers from './handlers.js';
import Commands from './commands.js';
import config from './config.js';

export const client = new Discord.Client();
export const distube = new DisTube(client, { searchSongs: false, emitNewSongOnly: false, leaveOnStop: false });

//#region Distube EventListener
distube.on('playSong', (message, queue, song) => {
        Handlers.sendEmbed({
            message: message,
            title: "Now Playing",
            description: song.name
        });
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

    Commands.resolveCommand(message, messageCommands);
})

//#endregion Message Listener