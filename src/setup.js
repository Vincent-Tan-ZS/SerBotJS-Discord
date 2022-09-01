import Discord from 'discord.js';
import { DisTube } from 'distube';
import { SpotifyPlugin } from '@distube/spotify';
import { YtDlpPlugin } from '@distube/yt-dlp'
import Utils from './utils.js';
import Commands from './commands.js';
import config from './config.js';
import EventManager from './events.js';
import schedule from 'node-schedule';
import { ConnectDB } from './mongo/mongo-conn.js';
import { showModal } from 'discord-modals';
import { countdownModal, createTierListModal } from './modals.js';
import moment from 'moment';
import { tierListModel, tierListUserMappingModel, countdownModel } from './mongo/mongo-schemas.js';

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
    .on('finish', (queue) => {
        Utils.timeout(() => {
            let newQueue = distube.getQueue(queue);

            if ((newQueue === undefined) || (newQueue.songs.length <= 0 && newQueue.repeatMode == 0)) {
                distube.voices.leave(queue);
            }
        }, 5 * 6 * 1000);
    });

//#endregion Distube EventListener

//#region Discord Client EventListeners
client.on('ready', async() => {
    console.log("SerBot is now online!");

    // MongoDB
    ConnectDB();

    // AC15
    const ac15UserIds = process.env.AC15_USERS.split(',').filter(x => x.length > 0);
    const users = await Promise.all(ac15UserIds.map(x => client.users.fetch(x)));

    ac15Dates.forEach(acDate => {
        console.log(`[Schedule] AC15 (${acDate.title}) Job scheduled for ${acDate.date.getDate()}/${acDate.date.getMonth()}/${acDate.date.getFullYear()}`);

        schedule.scheduleJob({ year: acDate.date.getFullYear(), month: acDate.date.getMonth() - 1, date: acDate.date.getDate(), hour: 18, minute: 0, second: 0, tz: "Asia/Kuala_Lumpur" }, () => {
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
    // Tier List Modal
    else if (interaction.customId === "create-tier-list") {
        showModal(createTierListModal, {
            client: client,
            interaction: interaction
        });
    } else if (interaction.customId === "create-countdown") {
        showModal(countdownModal, {
            client: client,
            interaction: interaction
        });
    }
});
//#endregion Interaction Listener

//#region Modal
client.on('modalSubmit', async(modal) => {
    let reply = "";

    switch (modal.customId) {
        case "create-tier-list-modal":
            const tierValues = modal.fields.map(x => x.value).filter(x => x !== null);

            const tierListName = tierValues.shift();

            if (tierValues.length <= 0) {
                reply = "You need at least one tier, please try again :)";
                return;
            }

            if (tierValues.find(x => !x.match(/^\w*:([ ]?\w*[,]?)+$/g)) !== undefined) {
                reply = "Please follow the correct format for a tier list. {TierName}: {item1},{item2},etc...";
                return;
            }

            let existing = await tierListModel.findOne({ Name: tierListName });

            if (existing !== null) {
                reply = "This tier list already exists! Name is the same as an existing one :(";
                return;
            }

            const tiers = tierValues.map(x => x.split(":")[0]);

            const newTierList = new tierListModel({
                Name: tierListName,
                Tiers: tiers,
                List: tiers.reduce((prev, tier, index, arr) => {
                    let _data = tierValues.find(x => x.startsWith(tier)).split(":")[1].split(",").map(x => x.trim());

                    arr = prev.concat(_data.map(x => {
                        return {
                            Tier: tier,
                            Data: x
                        }
                    }))
                    return arr;
                }, [])
            });

            const newTierListUserMap = new tierListUserMappingModel({
                UserId: modal.user.id,
                TierListId: newTierList._id.toString()
            });

            await Promise.all([
                newTierList.save(),
                newTierListUserMap.save()
            ]);

            reply = `Thanks for creating your tier list! You can view it by calling 'ser tierlist view ${tierListName}'!`;
            break;
        case "create-countdown-modal":
            const countdownName = modal.getTextInputValue("countdown-name");
            const countdownDate = modal.getTextInputValue("countdown-date");
            const countdownDesc = modal.getTextInputValue("countdown-description");
            const countdownImage = modal.getTextInputValue("countdown-image");
            const countdownURL = modal.getTextInputValue("countdown-url");

            const momentDate = moment(countdownDate);

            if (countdownName.length <= 0) {
                reply = "Please give this countdown a name!";
                return;
            }

            if (countdownDate.length <= 0 || momentDate.isValid() !== true) {
                reply = "Please give insert a valid date!";
                return;
            }

            let existingCD = await countdownModel.findOne({ Name: countdownName });

            if (existingCD !== null) {
                reply = "This countdown already exists!";
                return;
            }

            const newCountdown = new countdownModel({
                Name: countdownName,
                Date: countdownDate,
                Description: countdownDesc ?? "",
                Image: countdownImage ?? "",
                URL: countdownURL ?? "",
                UserId: modal.user.id
            });

            await newCountdown.save();

            reply = `Thanks for creating your countdown! You can view it by calling 'ser countdown ${countdownName}'!`;
            break;
    }

    modal.reply(reply);
});
//#endregion Modal