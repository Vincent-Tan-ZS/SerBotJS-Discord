import Discord from 'discord.js';
import { DisTube } from 'distube';
import { SpotifyPlugin } from '@distube/spotify';
import Handlers from './handlers.js';
import Commands from './commands.js';
import config from './config.js';

export const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_INVITES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});
export const distube = new DisTube(client,
{
  leaveOnStop: false,
  youtubeCookie: config.distubeCookie,
  plugins: [new SpotifyPlugin()]
});

//#region Distube EventListener
distube.on('playSong', (queue, song) => {
        Handlers.sendEmbed({
            channel: queue.textChannel,
            title: "Now Playing",
            description: song.name
        });
        console.log(`[Distube] Playing ${song.name}`);
    })
    .on('initQueue', queue => {
        queue.autoplay = false;
        queue.volume = 100;
    })
    .on('error', (channel, e) => {
        channel.send(`Error: ${e}`);
    })

//#endregion Distube EventListener

//#region Discord Client EventListeners
client.on('ready', () => {
    console.log("SerBot is now online!");
})

client.on('voiceStateUpdate', (oldState, newState) => {
    let user = oldState.member.user;
    if (!user.bot && !user.username == "SerBot") return;

    let voice = distube.voices.get(newState.guild);
    if (voice == null) return;

    if (!voice.selfDeaf) voice.setSelfDeaf(true);
})

//#endregion Discord Client EventListeners

//#region Message Listener
client.on('messageCreate', (message) => {
    let msgContent = message.content;

    if (!msgContent.startsWith(`${config.prefix} `)) return;

    let messageArray = msgContent.split(' ').slice(1, msgContent.split(' ').length);
    let messageCommands = messageArray.length > 1 ? messageArray : messageArray[0];

    Commands.resolveCommand(message, messageCommands);
})

//#endregion Message Listener