import Discord from 'discord.js';
import { DisTube } from 'distube';
import { SpotifyPlugin } from '@distube/spotify';
import Utils from './utils.js';
import Commands from './commands.js';
import config from './config.js';
import EventManager from './events.js';

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

export const distube = new DisTube(client, {
    leaveOnStop: false,
    youtubeCookie: config.distubeCookie,
    plugins: [new SpotifyPlugin()]
});

//#region Distube EventListener
distube.on('playSong', (queue, song) => {
        Utils.sendEmbed({
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
        channel.send(`Distube Error: ${e}`);
    })
    .on('deleteQueue', (queue) => {
        await Utils.sleep(60000);
        
        let newQueue = distube.getQueue(queue);

        if ((newQueue == undefined) || (newQueue.songs.length <= 0 && newQueue.repeatMode == 0)) {
          distube.voices.leave(queue);
        }
    });

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

client.on('error', (e) => {
  console.log(`DiscordJs Error: ${e}`);
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

client.on("messageReactionAdd", (reaction, user) => {
    EventManager.updateTicTacToe(reaction, user);
});

//#endregion Message Listener

//#region Interaction Listener
client.on("interactionCreate", (interaction) => {
    let message = interaction.message;
    let embed = message.embeds[0];

    // R6 Stats Select
    if (interaction.customId == "R6SeasonChange") {
        interaction.deferUpdate().then(() => {
            let username = embed.author.name.substr(0, embed.author.name.indexOf(" "));
            let titleMatch = embed.author.name.match(/\[(.*?)\]/);
            let platform = titleMatch[1];
            let seasonId = Number(interaction.values[0]);
            interaction.editReply({ content: "Retrieving, please wait...", embeds: [], components: [] });

            EventManager.updateR6Stats(username, platform, seasonId).then((newEmbed) => {
                interaction.editReply(newEmbed);
            });
        });
    }
});
//#endregion Interaction Listener