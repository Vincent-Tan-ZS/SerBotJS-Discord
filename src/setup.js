import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, GatewayIntentBits, Options, Partials } from 'discord.js';
import Utils from './utils.js';
import Commands from './commands.js';
import config from './config.js';
import EventManager from './events.js';
import schedule from 'node-schedule';
import { ConnectDB } from './mongo/mongo-conn.js';
import { countdownModel, commandModel, reminderModel, misclickCountModel } from './mongo/mongo-schemas.js';
import dayjs from 'dayjs';

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
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    makeCache: Options.cacheWithLimits({
        ...Options.DefaultMakeCacheSettings,
        MessageManager: 50,
        GuildMemberManager: {
            maxSize: 10,
            keepOverLimit: member => member.id === member.client.user.id
        }
    })
});

// const nodes = [
//     {
//         host: "localhost",
//         password: "youshallnotpass",
//         port: 2333,
//         secure: false,
//     },
// ];

// export const riffy = new Riffy(client, nodes, {
//     send: (payload) => {
//         const guild = client.guilds.cache.get(payload.d.guild_id);
//         if (guild) guild.shard.send(payload);
//     },
//     defaultSearchPlatform: "spsearch",
//     restVersion: "v4", // Or "v3" based on your Lavalink version.
// })

const ReactionRoleMap = {
    amongus: "767007058712592415",
    gtav: "767007142615711755",
    csgo: "767007162538262528",
    r6s: "767007020946948147",
    rocketleague: "767006976097386517",
    weirdchamp: "978622725469921320" //League of Legends
}

//#region Riffy EventListener
// riffy.on("trackStart", (player, track, payload) => {
//         let logMessage = "";

//         Utils.cancelTimeout(`leaveVC-${player.guildId}`);

//         if (player.loop === "none")
//         {
//             // Update Previous Song for replay
//             const previousSongIndex = Utils.PreviousSong.findIndex(s => s.guildId === player.guildId);
//             const guildPrevSong = {
//                 guildId: player.guildId,
//                 song: track.info.title
//             };

//             if (previousSongIndex >= 0)
//             {
//                 Utils.PreviousSong[previousSongIndex] = guildPrevSong;
//             }
//             else
//             {
//                 Utils.PreviousSong.push(guildPrevSong);
//             }

//             Utils.sendEmbed({
//                 channel: client.channels.resolve(player.textChannel),
//                 title: "Now Playing",
//                 description: track.info.title
//             });
//         }
//         else
//         {
//             logMessage += "[Loop] ";
//         }

//         logMessage += `Playing ${track.info.title} in ${player.guildId}`;

//         Utils.Log(Utils.LogType_INFO, logMessage, "Riffy");
//     })
//     .on("trackError", (player, track, payload) => {
//         client.channels.resolve(player.textChannel).send(`Riffy Track Error: ${payload.exception.message}`);
//         Utils.Log(Utils.LogType_ERROR, JSON.stringify(payload), "Riffy");
//     })
//     .on("queueEnd", (player) => {
//         Utils.QueueFinishedTimer(player.guildId);
//     })
//     .on("debug", (message) => {
//         Utils.Log(Utils.LogType_DEBUG, message, "Riffy");
//     })
//     .on("nodeError", (node, error) => {
//         Utils.Log(Utils.LogType_DEBUG, `Node ${node.name} Error: ${error.message}`, "Riffy");
//     })
//     .on("nodeDisconnect", (node, reason) => {
//         Utils.Log(Utils.LogType_DEBUG, `Node ${node.name} Disconnect: ${reason}`, "Riffy");
//     })
//     .on("nodeReconnect", (node) => {
//         Utils.Log(Utils.LogType_DEBUG, `Node ${node.name} Reconnected`, "Riffy");
//     })
//     .on("trackStuck", (player, track, payload) => {
//         Utils.Log(Utils.LogType_DEBUG, `Track Stuck: ${JSON.stringify(payload)}`, "Riffy");
//     })
//     .on("socketClosed", (player, payload) => {
//         Utils.Log(Utils.LogType_DEBUG, `Socket Closed: ${JSON.stringify(payload)}`, "Riffy");
//     })
//     .on("trackEnd", (player, track, payload) => {
//         Utils.Log(Utils.LogType_DEBUG, `Track Ended: ${JSON.stringify(payload)}`, "Riffy");
//     })
//#endregion Riffy EventListener

//#region Discord Client EventListeners
client.on('ready', async() => {
    Utils.Log(Utils.LogType_INFO, "SerBot is now online!");

    // Riffy
    // riffy.init(client.user.id);

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
        const todayDates = allReminders.filter(x => x.RemindDate !== undefined).filter(x => dayjs(x.RemindDate).isSame(new dayjs(), 'day'));
        const todayDaily = allReminders.filter(x => Number(x.Frequency) === Utils.Reminder_Frequency_Daily);
        const todayWeekly = allReminders.filter(x => x.LastMessageDate !== undefined).filter(x => dayjs().diff(x.LastMessageDate, 'd') % 7 === 0 && Number(x.Frequency) === Utils.Reminder_Frequency_Weekly);

        const userIdSet = new Set([].concat(todayDates.map(x => x.UserId)).concat(todayDaily.map(x => x.UserId)).concat(todayWeekly.map(x => x.UserId)));
        const userIds = Array.from(userIdSet);
        const users = await Promise.all(userIds.map(x => client.users.fetch(x)));

        todayDates.forEach(async (reminder) => {
            const user = users.find(u => u.id === reminder.UserId);
            try
            {
                await user.send(`[${dayjs(reminder.RemindDate).format("DD/MM/YYYY")} Reminder] ${reminder.Message}`);
                Utils.Log(Utils.LogType_INFO, `Reminded ${user.username} - ${reminder.Message}`, "Reminder");
            }
            catch (e)
            {
                Utils.Log(Utils.LogType_ERROR, e, "Reminder");
            }

            await reminderModel.deleteOne({ _id: reminder.id });
        });

        todayDaily.forEach(async (reminder) => {
            const user = users.find(u => u.id === reminder.UserId);
            try
            {
                await user.send({
                    content: `[Daily Reminder] ${reminder.Message}`,
                    components: [
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId(`delete-reminder-${reminder.id}`)
                            .setLabel('Delete Reminder')
                            .setStyle(ButtonStyle.Primary)
                        )
                    ]
                });

                Utils.Log(Utils.LogType_INFO, `Reminded ${user.username} - ${reminder.Message}`, "Reminder");
            }
            catch (e)
            {
                Utils.Log(Utils.LogType_ERROR, e, "Reminder");
            }

            reminder.set({
                LastMessageDate: dayjs().format("MM/DD/YYYY")
            });
            reminder.save();
        });

        todayWeekly.forEach(async (reminder) => {
            const user = users.find(u => u.id === reminder.UserId);
            try
            {
                await user.send({
                    content: `[Weekly Reminder] ${reminder.Message}`,
                    components: [
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId(`delete-reminder-${reminder.id}`)
                            .setLabel('Delete Reminder')
                            .setStyle(ButtonStyle.Primary)
                        )
                    ]
                });

                Utils.Log(Utils.LogType_INFO, `Reminded ${user.username} - ${reminder.Message}`, "Reminder");
            }
            catch (e)
            {
                Utils.Log(Utils.LogType_ERROR, e, "Reminder");
            }
            
            reminder.set({
                LastMessageDate: dayjs().format("MM/DD/YYYY")
            });
            reminder.save();
        });
    });

    // node-schedule refer
    // schedule.scheduleJob({ year, month, date, hour, minute, second, tz: "Asia/Kuala_Lumpur" }, () => {});
})

client.on('voiceStateUpdate', async (oldState, newState) => {
    let user = oldState.member.user;

    if (user.bot === true && user.username === "SerBot") {
        // if (riffy.players.has(newState.guild.id) !== true)
        // {
        //     Utils.Log(Utils.LogType_INFO, `SerBot left ${oldState.channel.name}`, "Voice State");
        //     Utils.cancelTimeout(`leaveVC-${oldState.channel.guild.id}`);
        //     return;
        // }
        
        Utils.Log(Utils.LogType_INFO, `SerBot joined ${newState.channel.name}`, "Voice State");
    }
    else if (newState.channelId == process.env.MISCLICK_VC_ID) {
        const existingMisclick = await misclickCountModel.findOne({ UserId: user.id });

        if (existingMisclick === null) {
            const newMisclick = new misclickCountModel({
                UserId: user.id,
                Username: user.username,
                AvatarUrl: user.avatarURL(),
                Count: 1
            });

            newMisclick.save();
        } 
        else {
            existingMisclick.set({
                AvatarUrl: user.avatarURL(),
                Username: user.username,
                Count: existingMisclick.Count + 1
            });
            existingMisclick.save();
        }
    }
})

client.on('error', (e) => {
    Utils.Log(Utils.LogType_ERROR, e.message, "DiscordJS");
})
//#endregion Discord Client EventListeners

//#region Message Listener
client.on('messageCreate', (message) => {
    let msgContent = message.content;

    if (!msgContent.toLowerCase().startsWith(`${config.prefix} `)) return;

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
    
    // Tic-Tac-Toe
    if (interaction.customId.startsWith("ttt")) {
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
    // Delete recurring reminder
    else if (interaction.customId.startsWith("delete-reminder"))
    {
        const reminderId = interaction.customId.split("-")[2];

        reminderModel.deleteOne({ _id: reminderId }).then((resp) => {
            if (resp.deletedCount > 0)
            {
                interaction.reply("Reminder has been deleted!");
            }
            else
            {
                throw "No reminder deleted, are you sure it's not already deleted?";
            }
        }).catch((e) => {
            interaction.reply(e);
            Utils.Log(Utils.LogType_ERROR, e, "Reminder");
        });
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

            let topIdCD = await countdownModel.find().sort({ "Id" : -1 }).limit(1);
            const newId = Number(topIdCD[0].Id) + 1;

            const newCountdown = new countdownModel({
                Name: countdown.name,
                Date: countdown.momentDate.format("MM/DD/YYYY"),
                Description: countdown.desc ?? "",
                Image: countdown.image ?? "",
                URL: countdown.url ?? "",
                UserId: interaction.user.id,
                Id: newId
            });

            newCountdown.save();

            reply = `Thanks for creating your countdown! You can view it by calling 'ser countdown ${countdown.name}' or 'ser countdown ${newId}'!`;
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

            reply = `Thanks for updating your countdown! You can view it by calling 'ser countdown ${countdown.name}' or 'ser countdown ${existingCD.Id}'!`;
            Utils.Log(Utils.LogType_INFO, `${interaction.user.username} updated ${countdown.name} Countdown`, "Countdown");
            break;
    }

    interaction.reply(reply);
}