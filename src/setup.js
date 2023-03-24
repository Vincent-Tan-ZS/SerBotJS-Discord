import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { DisTube, RepeatMode } from 'distube';
import { SpotifyPlugin } from '@distube/spotify';
import { YtDlpPlugin } from '@distube/yt-dlp'
import Utils from './utils.js';
import Commands from './commands.js';
import config from './config.js';
import EventManager from './events.js';
import schedule from 'node-schedule';
import { ConnectDB } from './mongo/mongo-conn.js';
import moment from 'moment';
import { tierListModel, tierListUserMappingModel, countdownModel, commandModel, reminderModel } from './mongo/mongo-schemas.js';

export const client = new Client({
    intents: [GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

export const distube = new DisTube(client, {
    leaveOnStop: false,
    youtubeCookie: config.distubeCookie,
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

//#region Distube EventListener
distube.on('playSong', (queue, song) => {
        let logMessage = "";

        if (queue.repeatMode === RepeatMode.DISABLED)
        {
            // Workaround for song not playing when hosted
            Utils.CurSongInfo.name = song.name;
            Utils.CurSongInfo.duration = song.duration - 1; // song.duration for some reason is almost always 1 second more than the supposed length 
            Utils.CurSongInfo.startTime = new Date();
    
            Utils.PreviousSong = song;

            Utils.sendEmbed({
                channel: queue.textChannel,
                title: "Now Playing",
                description: song.name
            });
        }
        else
        {
            logMessage += "[Loop] ";
        }

        logMessage += `Playing ${song.name}`;

        Utils.Log(Utils.LogType_INFO, logMessage, "DistubeJS");
    })
    .on('initQueue', queue => {
        queue.autoplay = false;
        queue.volume = 100;
    })
    .on('searchNoResult', (message, query) => {
        message.channel.send(`[Distube] ${query} not found.`);
        Utils.Log(Utils.LogType_INFO, `${query} not found`, "DistubeJS");
    })
    .on('error', (channel, e) => {
        channel.send(`Distube Error: ${e}`);
        Utils.Log(Utils.LogType_ERROR, e.message, "DistubeJS");
    })
    .on('addSong', (queue, song) => {
        Utils.cancelTimeout("leaveVC");
    })
    .on('finish', (queue) => {
        Utils.timeout("leaveVC", 5, () => {
            let newQueue = distube.getQueue(queue);

            if ((newQueue === undefined) || (newQueue.songs.length <= 0 && newQueue.repeatMode == 0)) {
                distube.voices.leave(queue);
            }
        });
    })
    .on('finishSong', (queue, song) => {
        if (queue.repeatMode === RepeatMode.SONG) return;
        if (song.name !== Utils.CurSongInfo.name) 
        {
            Utils.CurSongInfo = {
                name: "",
                duration: 0,
                startTime: undefined,
                isWorkaround: false
            };
            return;
        }

        // Workaround for song not playing when hosted
        let songPlayedFor = moment().diff(moment(Utils.CurSongInfo.startTime), 'seconds');

        if (Utils.CurSongInfo.duration > songPlayedFor && Utils.CurSongInfo.isWorkaround !== true && Utils.CurSongInfo.isSkip !== true)
        {
            const msg = "Song did not complete, playing workaround song";

            if (queue.textChannel !== undefined)
            {
                queue.textChannel.send(`[Distube] ${msg}`);
            }

            Utils.Log(Utils.LogType_INFO, msg, "DistubeJS");
            distube.play(queue.voiceChannel, `${song.name} lyrics soundtrack`);

            Utils.CurSongInfo.isWorkaround = true;
        }
        else
        {
            if (queue.textChannel !== undefined && Utils.CurSongInfo.isWorkaround === true)
            {
                queue.textChannel.send(`[Distube] Workaround cannot be played`);
            }

            Utils.CurSongInfo = {
                name: "",
                duration: 0,
                startTime: undefined,
                isWorkaround: false
            };
        }
    });

//#endregion Distube EventListener

//#region Discord Client EventListeners
client.on('ready', async() => {
    Utils.Log(Utils.LogType_INFO, "SerBot is now online!");

    // MongoDB
    await ConnectDB();

    // Save Commands in MongoDB
    Utils.Log(Utils.LogType_INFO, "Initializing Commands List");
    const dbCommandList = await commandModel.find({});
    const dbCommandPromises = [];

    // Add New Commands
    Commands.dictionaries.forEach((dict) => {
       const existing = dbCommandList.find(l => l.Title === dict.Title);

       if (existing !== undefined)
       {
            // If any different
            if (!Utils.ArrComp(existing.List, dict.Command) || existing.Description !== dict.Description || !Utils.ArrComp(existing.Usage, dict.Usage))
            {
                dbCommandPromises.push(
                    commandModel.replaceOne({_id: existing._id}, { 
                        List: dict.Command,
                        Description: dict.Description,
                        Usage: dict.Usage
                    })
                );
            }
       }
       else
       {
            const newCommand = new commandModel({
                Title: dict.Title,
                List: dict.Command,
                Description: dict.Description,
                Usage: dict.Usage
            });

            dbCommandPromises.push(newCommand.save());
        }
    });

    // Remove DB Commands that aren't in use anymore 
    dbCommandList.filter(command => Commands.dictionaries.find(d => d.Title === command.Title) === undefined).forEach((command) => {
        dbCommandPromises.push(command.remove());
    });

    try
    {
        await Promise.all(dbCommandPromises);
        Utils.Log(Utils.LogType_INFO, "Done Initializing Commands List");
    }
    catch (e)
    {
        Utils.Log(Utils.LogType_ERROR, `Error Initializing Commands List: ${e.message}`);
    }

    // Daily Reminder Check
    let reminderRule = new schedule.RecurrenceRule();
    reminderRule.tz = "Asia/Kuala_Lumpur";
    reminderRule.second = 0;
    reminderRule.minute = 0;
    reminderRule.hour = 9;

    schedule.scheduleJob(reminderRule, async () => {
        const allReminders = await reminderModel.find();
        const todayDates = allReminders.filter(x => x.RemindDate !== undefined).filter(x => moment(x.RemindDate).isSame(new moment(), 'day'));
        const todayDaily = allReminders.filter(x => Number(x.Frequency) === Utils.Reminder_Frequency_Daily);
        const todayWeekly = allReminders.filter(x => x.LastMessageDate !== undefined).filter(x => moment().diff(x.LastMessageDate, 'd') % 7 === 0 && Number(x.Frequency) === Utils.Reminder_Frequency_Weekly);

        const userIdSet = new Set([].concat(todayDates.map(x => x.UserId)).concat(todayDaily.map(x => x.UserId)).concat(todayWeekly.map(x => x.UserId)));
        const userIds = Array.from(userIdSet);
        const users = await Promise.all(userIds.map(x => client.users.fetch(x)));

        todayDates.forEach(async (reminder) => {
            const user = users.find(u => u.id === reminder.UserId);
            try
            {
                await user.send(`[${moment(reminder.RemindDate).format("DD/MM/YYYY")} Reminder] ${reminder.Message}`);
                Utils.Log(Utils.LogType_INFO, `Reminded ${user.username} - ${reminder.Message}`, "Reminder");
            }
            catch (e)
            {
                Utils.Log(Utils.LogType_ERROR, e, "Reminder");
            }

            await reminderModel.deleteOne({ id: reminder.id });
        });

        todayDaily.forEach(async (reminder) => {
            const user = users.find(u => u.id === reminder.UserId);
            try
            {
                await user.send(`[Daily Reminder] ${reminder.Message}`);
                Utils.Log(Utils.LogType_INFO, `Reminded ${user.username} - ${reminder.Message}`, "Reminder");
            }
            catch (e)
            {
                Utils.Log(Utils.LogType_ERROR, e, "Reminder");
            }

            reminder.set({
                LastMessageDate: moment().format("MM/DD/YYYY")
            });
            reminder.save();
        });

        todayWeekly.forEach(async (reminder) => {
            const user = users.find(u => u.id === reminder.UserId);
            try
            {
                await user.send(`[Weekly Reminder] ${reminder.Message}`);
                Utils.Log(Utils.LogType_INFO, `Reminded ${user.username} - ${reminder.Message}`, "Reminder");
            }
            catch (e)
            {
                Utils.Log(Utils.LogType_ERROR, e, "Reminder");
            }
            
            reminder.set({
                LastMessageDate: moment().format("MM/DD/YYYY")
            });
            reminder.save();
        });
    });

    // node-schedule refer
    // schedule.scheduleJob({ year, month, date, hour, minute, second, tz: "Asia/Kuala_Lumpur" }, () => {});
})

client.on('voiceStateUpdate', (oldState, newState) => {
    let user = oldState.member.user;
    if (user.bot !== true && user.username !== "SerBot") return;

    let voice = distube.voices.get(newState.guild);
    if (voice == null) {
        Utils.Log(Utils.LogType_INFO, `SerBot left ${oldState.channel.name}`, "Voice State");
        Utils.cancelTimeout("leaveVC");
        return;
    };

    if (!voice.selfDeaf) voice.setSelfDeaf(true);

    Utils.Log(Utils.LogType_INFO, `SerBot joined ${newState.channel.name}`, "Voice State");

    // TODO: Delete when '1 minute voiceconnection' issue fixed
    voice.connection.on('stateChange', (oldVState, newVState) => {
        const oldNetworking = Reflect.get(oldVState, 'networking');
        const newNetworking = Reflect.get(newVState, 'networking');
        
        const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
            const newUdp = Reflect.get(newNetworkState, 'udp');
            clearInterval(newUdp?.keepAliveInterval);
        }
        
        oldNetworking?.off('stateChange', networkStateChangeHandler);
        newNetworking?.on('stateChange', networkStateChangeHandler);
    });
})

client.on('error', (e) => {
    Utils.Log(Utils.LogType_ERROR, e.message, "DiscordJS");
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
client.on("interactionCreate", async (interaction) => {
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
    // Cancel Update Countdown
    else if (interaction.customId === "update-countdown-cancel")
    {
        const oriCDIndex = Utils.OriginalCountdownList.findIndex(x => x.userId === interaction.user.id);
        Utils.OriginalCountdownList.splice(oriCDIndex, 1);

        interaction.reply("Update Countdown has been cancelled, you may proceed with another update if you wish to :D");
    }
    // Show Modals
    else if (Utils.IsShowModal(interaction.customId))
    {
        Utils.ShowModal(interaction);
    }
    // Modal Submits
    else if (interaction.isModalSubmit())
    {
        await ModalSubmit(interaction);
    }
});
//#endregion Interaction Listener

const ModalSubmit = async (interaction) => {
    let reply = "";

    // Countdown variables
    let countdown;
    let existingCD;

    modal_switch:
    switch (interaction.customId) {
        case "create-tier-list-modal":
            const tierValues = interaction.fields.fields.map(x => x.value).filter(x => x !== null);

            const tierListName = tierValues.shift();

            if (tierValues.length <= 0) {
                reply = "You need at least one tier, please try again :)";
                break modal_switch;
            }

            if (tierValues.find(x => !x.match(/^\w*:([ ]?\w*[,]?)+$/g)) !== undefined) {
                reply = "Please follow the correct format for a tier list. {TierName}: {item1},{item2},etc...";
                break modal_switch;
            }

            let existing = await tierListModel.findOne({ Name: tierListName });

            if (existing !== null) {
                reply = "This tier list already exists! Name is the same as an existing one :(";
                break modal_switch;
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
                UserId: interaction.user.id,
                TierListId: newTierList._id.toString()
            });

            await Promise.all([
                newTierList.save(),
                newTierListUserMap.save()
            ]);

            reply = `Thanks for creating your tier list! You can view it by calling 'ser tierlist view ${tierListName}'!`;
            Utils.Log(Utils.LogType_INFO, `${interaction.user.username} created ${tierListName} Tier List`, "Tier List");
            break;
        case "create-countdown-modal":
            countdown = Utils.ExtractModalValues("countdown", interaction);

            if (countdown.name.length <= 0) {
                reply = "Please give this countdown a name!";
                break modal_switch;
            }

            if (countdown.date.length <= 0 || countdown.momentDate.isValid() !== true) {
                reply = "Please insert a valid date!";
                break modal_switch;
            }

            existingCD = await countdownModel.findOne({ Name: countdown.name });

            if (existingCD !== null) {
                reply = "This countdown already exists!";
                break modal_switch;
            }

            const newCountdown = new countdownModel({
                Name: countdown.name,
                Date: countdown.momentDate.format("MM/DD/YYYY"),
                Description: countdown.desc ?? "",
                Image: countdown.image ?? "",
                URL: countdown.url ?? "",
                UserId: interaction.user.id
            });

            newCountdown.save();

            reply = `Thanks for creating your countdown! You can view it by calling 'ser countdown ${countdown.name}'!`;
            Utils.Log(Utils.LogType_INFO, `${interaction.user.username} created ${countdown.name} Countdown`, "Countdown");
            break;
        case "update-countdown-modal":
            countdown = Utils.ExtractModalValues("update-countdown", interaction);

            if (countdown.date.length <= 0 || countdown.momentDate.isValid() !== true) {
                reply = "Please insert a valid date!";
                break modal_switch;
            }

            existingCD = await countdownModel.findOne({ Name: countdown.name });

            if (existingCD === null) {
                reply = "This countdown doesn't exist!";
                break modal_switch;
            }

            existingCD.set({
                Name: countdown.name,
                Date: countdown.momentDate.format("MM/DD/YYYY"),
                Description: countdown.desc ?? "",
                Image: countdown.image ?? "",
                URL: countdown.url ?? "",
                UserId: interaction.user.id
            });
            existingCD.save();

            Utils.OriginalCountdownList.splice(countdown.index, 1);

            reply = `Thanks for updating your countdown! You can view it by calling 'ser countdown ${countdown.name}'!`;
            Utils.Log(Utils.LogType_INFO, `${interaction.user.username} updated ${countdown.name} Countdown`, "Countdown");
            break;
    }

    interaction.reply(reply);
}