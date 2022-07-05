import Discord from 'discord.js';
import { DisTube } from 'distube';
import { SpotifyPlugin } from '@distube/spotify';
import { YtDlpPlugin } from '@distube/yt-dlp'
import Utils from './utils.js';
import Commands from './commands.js';
import config from './config.js';
import EventManager from './events.js';
import schedule from 'node-schedule';

export const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_INVITES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

export const distube = new DisTube(client, {
    leaveOnStop: false,
    youtubeCookie: config.distubeCookie,
    youtubeDL: false,
    plugins: [new SpotifyPlugin(), new YtDlpPlugin()]
});

const ReactionRoleMap = {
    amongus: "767007058712592415",
    gtav: "767007142615711755",
    csgo: "767007162538262528",
    r6s: "767007020946948147",
    rocketleague: "767006976097386517",
    weirdchamp: "978622725469921320" //League of Legends
}

const ac15Dates = [
    { title: "Syndicate", date: new Date(2022, 7, 12) },
    { title: "Unity", date: new Date(2022, 7, 19) },
    { title: "Rogue", date: new Date(2022, 7, 26) },
    { title: "IV Black Flag", date: new Date(2022, 8, 2) },
    { title: "III", date: new Date(2022, 8, 9) },
    { title: "Revelations", date: new Date(2022, 8, 16) },
    { title: "Brotherhood", date: new Date(2022, 8, 23) },
    { title: "II", date: new Date(2022, 8, 30) },
    { title: "I", date: new Date(2022, 9, 6) }
];

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
    .on('searchNoResult', (message, query) => {
        message.channel.send(`[Distube] ${query} not found.`);
    })
    .on('error', (channel, e) => {
        channel.send(`Distube Error: ${e}`);
    })
    .on('deleteQueue', (queue) => {
        Utils.sleep(5 * 60 * 1000).then(() => {
            let newQueue = distube.getQueue(queue);

            if ((newQueue == undefined) || (newQueue.songs.length <= 0 && newQueue.repeatMode == 0)) {
                distube.voices.leave(queue);
            }
        });
    });

//#endregion Distube EventListener

//#region Discord Client EventListeners
client.on('ready', async() => {
    console.log("SerBot is now online!");

    const ac15UserIds = process.env.AC15_USERS.split(',').filter(x => x.length > 0);
    const users = await Promise.all(ac15UserIds.map(x => client.users.fetch(x)));

    ac15Dates.forEach(acDate => {
        console.log(`[Schedule] AC15 (${acDate.title}) Job scheduled for ${acDate.date.getDate()}/${acDate.date.getMonth()}/${acDate.date.getFullYear()}`);

        schedule.scheduleJob({ year: acDate.date.getFullYear(), month: acDate.date.getMonth() - 1, date: acDate.date.getDate(), hour: 12, minute: 0, second: 0, tz: "Asia/Kuala_Lumpur" }, () => {
            users.forEach(user => {
                user.send(`Do the Assassin's Creed 15th Anniversary Twelve Trials today!\nThis week's game: Assassin's Creed ${acDate.title}\n\nhttps://www.assassinscreed15.com/12-trials`);
            })
        });
    });
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

//#endregion Message Listener

//#region Reaction Listener
client.on("messageReactionAdd", async(reaction, user) => {
    if (reaction.message.id == config.enrollmentMessageId) {
        let guild = reaction.message.guild;

        let [member, role] = await Promise.all([
            guild.members.fetch(user),
            guild.roles.fetch(ReactionRoleMap[reaction.emoji.name])
        ]);

        member.roles.add(role);
    }
});

client.on("messageReactionRemove", async(reaction, user) => {
    if (reaction.message.id == config.enrollmentMessageId) {
        let guild = reaction.message.guild;

        let [member, role] = await Promise.all([
            guild.members.fetch(user),
            guild.roles.fetch(ReactionRoleMap[reaction.emoji.name])
        ]);

        member.roles.remove(role);
    }
});
//#endregion Region Listener

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
    // Tic-Tac-Toe
    else if (interaction.customId.startsWith("ttt")) {
        let payload = interaction.customId.slice(3);
        let gameId = payload.slice(0, 64);
        let selectedSquare = payload.slice(64);
        EventManager.updateTicTacToe(gameId, selectedSquare, interaction.user, message);

        interaction.deferUpdate();
    }
});
//#endregion Interaction Listener