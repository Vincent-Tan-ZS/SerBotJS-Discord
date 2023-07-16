import * as Covid from 'novelcovid';
import moment from 'moment-timezone';
import path from 'path';
import sharp from 'sharp';
import axios from 'axios';

import { client, distube as Distube } from './setup.js';
import config from './config.js';
import Utils from './utils.js';
import { wikihow } from './wikihow.js';
import TicTacToe from './tictactoe.js';
import "./extension.js";
import { RepeatMode } from 'distube';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } from 'discord.js';
import { countdownModel, reminderModel } from './mongo/mongo-schemas.js';

const seasonDates = {
    Spring: ["01/09/1990", "30/11/1990"],
    Summer: ["01/12/1990", "28/02/1990"],
    Autumn: ["01/03/1990", "31/05/1990"],
    Winter: ["01/06/1990", "31/08/1990"]
}

const seasonLeaves = {
    Spring: '🟪',
    Summer: '🟩',
    Autumn: '🟧',
    Winter: '⬜',
    Christmas: '🟩'
}

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default class EventManager {
    constructor() {}

    // Command List Action
    static sendCommandList(message) {
        message.channel.send(`${process.env.SITE_LINK}/commands`);
    }

    // Ping
    static ping(message) {
        message.channel.send("Pong!");
    }

    // Greeting Actions
    static sendGreeting(message) {
        let rng = Utils.RandNum();
        let channel = message.channel;
        let greeter = message.author;

        if (rng > 0.9) {
            channel.send("If you talk to me again I swear to God, it will be the last time you have access to fingers.");
        } else if (rng > 0.6) {
            channel.send(`Hey there ${greeter.username}!`);
        } else if (rng > 0.4) {
            channel.send(`Hey ${greeter.username}!`);
        } else if (rng > 0.2) {
            channel.send(`How's it going ${greeter.username}?`);
        } else if (rng > 0) {
            channel.send(`Hello ${greeter.username}!`);
        }
    }

    // Covid Actions
    static getCovidCases(message, commands) {
        commands.shift();
        let countryName = commands[0];
        let countryData = { name: countryName, flag: "" };
        let todayData = { cases: 0, deaths: 0, recovered: 0 };
        let yesterdayData = { cases: 0, deaths: 0, recovered: 0 };

        Promise.all([
            Covid.countries({ country: countryName }).then((result) => {
                todayData.cases = result.todayCases;
                todayData.deaths = result.todayDeaths;
                todayData.recovered = result.todayRecovered;
                countryData.name = result.country;
                countryData.flag = result.countryInfo.flag;
            }),
            Covid.yesterday.countries({ country: countryName }).then((result) => {
                yesterdayData.cases = result.todayCases;
                yesterdayData.deaths = result.todayDeaths;
                yesterdayData.recovered = result.todayRecovered;
            })
        ]).then(() => {
            Utils.sendEmbed({
                message: message,
                title: countryData.name,
                description: "Cases / Deaths / Recovered",
                thumbnail: countryData.flag,
                fields: new Array({ name: 'Today', value: `${todayData.cases} / ${todayData.deaths} / ${todayData.recovered}` }, { name: 'Yesterday', value: `${yesterdayData.cases} / ${yesterdayData.deaths} / ${yesterdayData.recovered}` })
            });
        });
    }

    // Music Actions
    static playMusic(message, commands) {
        if (message.member.voice.channel == null) return;

        commands.shift();
        let songTitle = commands.join(" ");

        // Check if YT link is part of a playlist, only play current video if so
        if (songTitle.includes("&list="))
        {
            songTitle = songTitle.split("&list=")[0];
        }

        Distube.play(message.member.voice.channel, songTitle, {
            member: message.member,
            textChannel: message.channel
        }).then(() => {
            let queue = Distube.getQueue(message);
            
            if (queue !== undefined && queue.songs.length > 1) {
                let song = queue.songs[queue.songs.length - 1];
                let msgAuthor = message.author;
                Utils.sendEmbed({
                    message: message,
                    author: `${msgAuthor.username} Queued`,
                    authorIcon: msgAuthor.avatarURL({ dynamic: true }),
                    title: song.name,
                    footer: ` | ${song.formattedDuration}`,
                    footerIcon: config.embedPauseIconURL
                });
            }
        }).catch((e) => {
            Utils.Log(Utils.LogType_ERROR, e, "DistubeJS");
        });
    }

    static removeMusic(message, commands) {
        let queueRemoveIndex = parseInt(commands[1]);
        let queue = Distube.getQueue(message);
        let isError = this.songRemoveErrorHandler(queue, message, queueRemoveIndex);

        if (isError) return;

        --queueRemoveIndex;
        let song = queue.songs[queueRemoveIndex];
        queue.songs.splice(queueRemoveIndex, 1);

        Utils.sendEmbed({
            message: message,
            title: "Song Removed",
            Description: song.name
        });
    }

    static sendGuildQueue(message, command) {
        if (command != "q" && command != "queue") return;

        let queue = Distube.getQueue(message);

        let description = queue == undefined || queue.songs.length == 0 ? "No tracks in queue!" :
            queue.songs.map((song, index) => {
                return `${index + 1}. ${song.name}`;
            }).join("\n");

        Utils.sendEmbed({
            message: message,
            title: "Queue",
            description: description
        });
    }

    static joinOrLeaveVC(message, command, userChannel) {
        let queue = Distube.getQueue(message);
        let guild = message.channel.guild;
        let voiceConnection = Distube.voices.collection.find(x => x.id == guild.id);
        let isSameChannel = voiceConnection != null ?
            voiceConnection.voiceState.channelId == userChannel.id : false;

        switch (command) {
            case "join":
                if (queue == null && !isSameChannel) {
                    Distube.voices.join(userChannel);
                }
                break;
            case "leave":
                if (isSameChannel) {
                    // If there is a queue
                    if (queue != null) {
                        if (queue.playing) {
                            Distube.stop(queue);
                        }

                        if (queue.songs.length > 0) {
                            queue.songs = [];
                        }
                    }

                    // Leave VC
                    Distube.voices.leave(guild);
                }
                break;
        }
    }

    static musicAction(message, command, userChannel) {
        let queue = Distube.getQueue(message);
        if (queue == null) return;

        let guild = message.channel.guild;
        let voiceConnection = Distube.voices.collection.find(x => x.id == guild.id);
        let isSameChannel = voiceConnection != null ?
            voiceConnection.voiceState.channelId == userChannel.id : false;

        if (!isSameChannel) return;

        switch (command) {
            case "pause":
                this.toggleQueuePause(true, queue);
                break;
            case "resume":
                this.toggleQueuePause(false, queue);
                break;
            case "skip":
                if (queue.songs.length > 1) {
                    Distube.skip(queue);
                } else {
                    Distube.stop(queue);
                }
                Utils.CurSongInfo.isSkip = true;
                message.react('👍');
                break;
            case "stop":
                Distube.stop(queue);
                break;
            case "clear":
                if (queue.songs.length > 0) {
                    queue.songs = [];

                    Utils.sendEmbed({
                        message: message,
                        title: "Queue Cleared",
                    });
                }
                break;
            case "loop":
            case "l":
                let repeatMode = queue.repeatMode == RepeatMode.DISABLED ? RepeatMode.SONG : RepeatMode.DISABLED;
                let description = queue.repeatMode == RepeatMode.DISABLED ? "Looping current track" : "Stopped looping current track";

                Distube.setRepeatMode(queue, repeatMode);

                Utils.sendEmbed({
                    message: message,
                    title: "Queue Loop",
                    description: description
                });

                break;
        }
    }

    static sendDay(message) {
        let today = moment().tz("Asia/Kuala_Lumpur").format("dddd");
        message.channel.send(`[GMT+8] ${today}`);
    }

    // Tic-Tac-Toe
    static async playTicTacToe(message, commands) {
        if (typeof(commands) == 'string') return;

        let player = message.author.id;
        let otherPlayer = Utils.getUserIdFromMention(commands[1]);

        if (otherPlayer === config.botId) {
            message.channel.send("I'm touched but I cannot play Tic-Tac-Toe :(");
            return;
        }

        if (player === otherPlayer) {
            Utils.sendEmbed({
                message: message,
                isError: true,
                title: "Tic-Tac-Toe",
                description: "Please don't play Tic-Tac-Toe by yourself :("
            });
            return;
        }

        let otherPlayerUser = await message.guild.members.fetch(otherPlayer);
        let gameId = TicTacToe.newGame(message.author, otherPlayerUser.user);

        if (gameId.length <= 0) {
            Utils.sendEmbed({
                message: message,
                isError: true,
                title: "Tic-Tac-Toe",
                description: "Only one game with the same player at a time allowed"
            });
            return;
        }

        let game = TicTacToe.allGames.find(x => x._id == gameId);
        let gameMessage = game.createOrUpdateMessage();

        message.channel.send(gameMessage);
    }

    static updateTicTacToe(gameId, reactedEmoji, user, message) {
        let game = TicTacToe.allGames.find(x => x._id == gameId);
        if (game == null) return;
        if (game._player1 != user.id && game._player2 != user.id) return;
        if (game._emojiList.includes(reactedEmoji)) return;

        if (reactedEmoji == "❌") {
            TicTacToe.cancelMatch(game);
            let gameMessage = game.createOrUpdateMessage(true);
            message.edit({
                content: gameMessage.content + `Match Cancelled [${user.username}]`.ToBold(),
                components: gameMessage.components
            });
            return;
        }

        let isPlayer1 = game._player1 == user.id;

        if ((game._playerTurn == 1 && !isPlayer1) ||
            (game._playerTurn == 2 && isPlayer1)) {
            return;
        }

        game._emojiList.push(reactedEmoji);
        let gameMessage = game.createOrUpdateMessage();

        message.edit({
            content: gameMessage.content,
            components: gameMessage.components
        }).then((msg) => {
            game.endOfRoundAction(msg);
        });
    }

    static replyCopypasta(message, commands) {
        if (commands.length < 3) return;
        commands.shift();

        let mention = commands.shift();
        let userId = Utils.getUserIdFromMention(mention);

        if (userId.length <= 0 || isNaN(userId)) {
            Utils.sendEmbed({
                message: message,
                isError: true,
                title: "Copypasta",
                description: "Please mention a user. (ser copypasta @SerBot [Game Title])"
            });
            return;
        }

        if (userId == message.author.id) {
            Utils.sendEmbed({
                message: message,
                isError: true,
                title: "Copypasta",
                description: "Please mention someone else other than yourself :)"
            });
            return;
        }

        message.reply(`Sorry ${mention}, I dm'd you this acting on a whim. However, if you do wish to ${commands.join(" ")} tomorrow, I am more than up for it.`);
    }

    static createRhombus(message, commands) {
        commands.shift();
        if (Number.isNaN(commands[0])) return;

        let rhombusSize = Number(commands[0]);

        if (rhombusSize <= 0) {
            Utils.sendEmbed({
                message: message,
                title: "Rhombus",
                description: "Rhombus must have a size! HOW YOU FINNA MAKE A RHOMBUS WITH NO SIZE??????"
            });
            return;
        }

        if (rhombusSize == 1) {
            Utils.sendEmbed({
                message: message,
                title: "Rhombus",
                description: "Rhombus too smol, gib bigger number"
            });
            return;
        }

        let width = (2 * rhombusSize) - 1;
        let lineWidth = width;

        let rhombus = "* ".repeat(lineWidth).slice(0, -1);

        while (lineWidth > 0) {
            lineWidth--;
            let counter = width - lineWidth;

            let whitespace = " ".repeat(counter);
            let prePostLine = "* ".repeat(lineWidth).slice(0, -1);

            rhombus = `${whitespace}${prePostLine}\n${rhombus}\n${whitespace}${prePostLine}`;
        }

        let content = rhombusSize > 15 ?
            "Bit massive innit bruv?" :
            " ";

        message.channel.send({
            content: content,
            files: [{
                attachment: Buffer.from(rhombus, 'utf-8'),
                name: `${rhombusSize}Rhombus.txt`
            }]
        });
    }

    static searchWikiHow(message, commands) {
        if (Array.isArray(commands)) {
            commands.shift();
        }

        if (commands.length <= 0 || typeof(commands) === 'string') {
            Utils.sendEmbed({
                message: message,
                isError: true,
                title: "WikiHow",
                description: "Empty query"
            });
            return;
        }

        wikihow(commands.join(" ")).then((data) => {
            if (data == null) {
                Utils.sendEmbed({
                    message: message,
                    isError: true,
                    title: "WikiHow",
                    description: "You did it, this query does not exist in WikiHow, good job :)"
                });
            } else {
                message.channel.send(data.url);
            }
        });
    }

    static reply8Ball(message) {
        const rng = Utils.MaxRandNum(config.eightBallReplies.length);
        message.channel.send(config.eightBallReplies[rng]);
    }

    static coinFlip(message) {
        const msg = Utils.RandNum() >= 0.5 ? "Heads" : "Tails";
        message.channel.send(`🪙 ${msg}`);
    }

    static wheel(message, commands) {
        commands.shift();
        if (commands.length <= 0) return;

        let optionStr = commands.join(' ');
        let listOfOptions = optionStr.split(",");

        if (listOfOptions.length <= 1) return;

        const index = Utils.MaxRandNum(listOfOptions.length);
        message.channel.send(`🎡 ${listOfOptions[index].trim()}`);
    }

    static tree(message) {
        let seasonStart;
        let seasonEnd;

        let nowMoment = moment().tz("Asia/Kuala_Lumpur");
        let isChristmas = nowMoment.month() == 11 && nowMoment.date() == 25;
        let season = "Christmas";

        if (!isChristmas) {
            season = Object.keys(seasonDates).find(key => {
                seasonStart = moment(seasonDates[key][0], "DD/MM/YYYY").year(nowMoment.year());
                seasonEnd = moment(seasonDates[key][1], "DD/MM/YYYY").year(nowMoment.year());

                if (seasonEnd.isBefore(seasonStart))
                {
                    seasonStart = seasonStart.subtract(1, 'y');
                }

                return nowMoment.isBetween(seasonStart, seasonEnd, undefined, '[]');
            });
        }

        let now = nowMoment.format("DD MMMM YYYY");
        let label = `${season} ${now} Tree`;

        let leaf = seasonLeaves[season];
        let specialLeaf = isChristmas ? '🟥' : leaf;
        let specialLeaf2 = isChristmas ? '🟦' : leaf;
        let trunk = '🟫';

        let msg = `${label}\n`;
        msg += `\t\t\t${leaf}\n`;
        msg += `\t  ${specialLeaf}${leaf}${leaf}\n`;
        msg += `${leaf}${specialLeaf2}${leaf}${specialLeaf}${leaf}\n`;
        msg += `\t\t\t${trunk}\n`;
        msg += `\t\t\t${trunk}\n`;
        msg += `\t\t\t${trunk}\n`;

        message.channel.send(msg);
    }

    static async psycho(message, commands) {
        if (message.author === undefined) return;
        commands.shift();

        const username = message.author.username.substring(0, 24);;
        const imgFolder = path.resolve("./img");
        let sharpBuffer;
        let outputBuffer;
        let msg;

        try {
            // Card
            if (commands.length > 0 && commands[0] == "card") {
                msg = `Let's see ${username}'s card`;

                const svgImage = `
                    <svg width="1389" height="500">
                        <style>
                            .title { fill: #423e3d; font-size: 56px; font-weight: bold;}
                        </style>
                        <g transform="rotate(9, 0, 0)" >
                            <rect width="320" height="60" style="fill:rgb(144, 144, 158)" x="39%" y="27%"/>
                            <text x="51%" y="38%" text-anchor="middle" class="title">${username.toUpperCase()}</text>
                        </g>
                    </svg>
                    `;

                sharpBuffer = Buffer.from(svgImage);
                outputBuffer = await sharp(`${imgFolder}/psycho-card.png`)
                    .composite([{
                        input: sharpBuffer
                    }]).toBuffer();
            }
            // Monologue
            else {
                let avatarImg = await sharp((await axios({ url: message.author.avatarURL(), responseType: "arraybuffer" })).data);
                msg = `There is an idea of a ${username}. Some kind of abstraction. But there is no real me. Only an entity. Something illusory. And though I can hide my cold gaze, and you can shake my hand and feel flesh gripping yours, and maybe you can even sense our lifestyles are probably comparable, I simply am not there.`;

                sharpBuffer = await avatarImg.resize({ width: 500, height: 500 }).toBuffer();
                outputBuffer = await sharp(`${imgFolder}/patrick-bateman.png`)
                    .composite([{
                        input: sharpBuffer
                    }]).toBuffer();
            }
        } catch (e) {
            console.log(e);
        } finally {
            message.channel.send({
                content: msg,
                files: [{
                    attachment: outputBuffer
                }]
            });
        }
    }

    static async countdown(message, commands) {
        if (message.author === undefined) return;
        commands.shift();

        const invalidEmbed = {
            message: message,
            title: "Countdown",
            description: "Commands: list, [name], create, update [name], delete [name]"
        };

        if (commands.length <= 0) {
            Utils.sendEmbed(invalidEmbed);
            return;
        }

        let countdownName = "";
        let countdown;
        let userId = "";

        switch (commands[0]) {
            case "list":
            case "l":
                let allCountdowns = await countdownModel.find({}).sort({ Id: 'asc' });

                let description = `You can either use the Id or Name for viewing/updating!\n\n`
                description += allCountdowns.map(cd => `${cd.Id} - ${cd.Name}`).join("\n");
    
                Utils.sendEmbed({
                    message: message,
                    title: "Countdown",
                    description: description
                });
                break;
            case "create":
            case "c":
                message.author.send({
                    content: 'Click below to start creating a countdown!',
                    components: [
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId('create-countdown')
                            .setLabel('Start')
                            .setStyle('Primary')
                        )
                    ]
                });
                break;
            case "update":
                if (commands.length <= 1) {
                    Utils.sendEmbed({
                        message: message,
                        title: "Countdown",
                        description: "Please use 'update [name]' or 'update [id]' to update a countdown :)"
                    });
                    return;
                }

                commands.shift();
                countdownName = commands.join(" ");

                countdown = isNaN(countdownName)
                    ? await countdownModel.findOne({ Name: countdownName })
                    : await countdownModel.findOne({ Id: Number(countdownName) })

                if (countdown === null) {
                    Utils.sendEmbed({
                        message: message,
                        title: "Countdown",
                        description: "The countdown doesn't exist :("
                    });
                    return;
                }

                userId = countdown.UserId;

                if (userId !== message.author.id) {
                    Utils.sendEmbed({
                        message: message,
                        title: "Countdown",
                        description: "Only the countdown creator can update their own countdowns, sorry!"
                    });
                    return;
                }

                let existingOriginalCountdownIndex = Utils.OriginalCountdownList.findIndex(x => x.userId === userId);

                const origCD = {  
                    name: countdown.Name,
                    date: moment(countdown.Date).format("DD/MM/YYYY"),
                    description: countdown.Description,
                    image: countdown.Image,
                    url: countdown.URL,
                    userId: userId
                };

                if (existingOriginalCountdownIndex >= 0)
                {
                    Utils.OriginalCountdownList[existingOriginalCountdownIndex] = origCD;
                }
                else
                {
                    Utils.OriginalCountdownList.push(origCD)
                }
                
                message.author.send({
                    content: `Click below to start updating the ${countdown.Name} countdown!`,
                    components: [
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId('update-countdown')
                            .setLabel('Update Countdown')
                            .setStyle('Primary')
                        )
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId('update-countdown-cancel')
                            .setLabel('Cancel')
                            .setStyle(ButtonStyle.Danger)
                        )
                    ]
                });
                break;
            case "delete":
                if (commands.length <= 1) {
                    Utils.sendEmbed({
                        message: message,
                        title: "Countdown",
                        description: "Please use 'delete [name]' to delete a countdown :)"
                    });
                    return;
                }

                commands.shift();
                countdownName = commands.join(" ");
                countdown = await countdownModel.findOne({ Name: countdownName });

                if (countdown === null) {
                    Utils.sendEmbed({
                        message: message,
                        title: "Countdown",
                        description: "The countdown doesn't exist :("
                    });
                    return;
                }

                userId = countdown.UserId;

                if (userId !== message.author.id) {
                    Utils.sendEmbed({
                        message: message,
                        title: "Countdown",
                        description: "Only the countdown creator can delete their own countdowns, sorry!"
                    });
                    return;
                }

                await Promise.all([
                    countdownModel.deleteOne({ Name: countdownName })
                ]);

                Utils.Log(Utils.LogType_INFO, `${message.author.username} deleted ${countdownName} Countdown`, "Countdown");
                message.channel.send("Countdown deleted!");
                break;
            default:
                if (commands.length <= 0) {
                    Utils.sendEmbed({
                        message: message,
                        title: "Countdown",
                        description: "Please use '[name]' to view a countdown :)"
                    });
                    return;
                }

                countdownName = commands.join(" ");

                countdown = isNaN(countdownName)
                ? await countdownModel.findOne({ Name: countdownName })
                : await countdownModel.findOne({ Id: Number(countdownName) })

                if (countdown === null) {
                    Utils.sendEmbed({
                        message: message,
                        title: "Countdown",
                        description: "The countdown doesn't exist :("
                    });
                    return;
                }

                let releaseDateMoment = moment(countdown.Date);
                let difference = releaseDateMoment.diff(moment(), 'days', true);

                if (difference < 0) {
                    Utils.sendEmbed({
                        message: message,
                        title: "Countdown",
                        description: `${countdownName} should already be completed!`
                    });
                    return;
                };

                let releaseCountdown = difference <= 0 ?
                    "TODAY" : difference <= 1 ?
                    "TOMORROW" : `${Math.ceil(difference)} days and counting...`;

                let embedObj = {
                    message: message,
                    title: countdown.Name,
                    fields: [{
                        name: "Release Date",
                        value: moment(countdown.Date).format("DD/MM/YYYY"),
                        inline: true
                    }, {
                        name: "Countdown",
                        value: releaseCountdown,
                        inline: true
                    }],
                    setTimestamp: true
                };

                if (countdown.Description !== undefined && countdown.Description.length > 0) {
                    embedObj.description = countdown.Description;
                }

                if (countdown.Image !== undefined && countdown.Image.length > 0) {
                    embedObj.embedImage = countdown.Image;
                }

                if (countdown.URL !== undefined && countdown.URL.length > 0) {
                    embedObj.embedURL = countdown.URL;
                }

                Utils.sendEmbed(embedObj);
                break;
        }
    }

    static async wisdomLlama(message, commands) {
        if (message.author === undefined) return;
        commands.shift();

        const imgFolder = path.resolve("./img");
        let sharpBuffer;
        let outputBuffer;
        let msg;

        let errMsg = "";
        let isErr = false;

        try {
            if (commands.length <= 0) {
                isErr = true;
                errMsg = "Please provide your wisdom :)";
            }
            else if (commands.join(" ").length > 100)
            {
                isErr = true;
                errMsg = "Your wisdom is wise but too long bruv";
            }
            else {
                let lineArr = [];

                const lines = commands.reduce((prev, cur, ind, arr) => {
                    lineArr.push(cur);

                    if (lineArr.join(" ").length > 20)
                    {
                        lineArr.pop();
                        prev.push(lineArr.join(" "));
                        lineArr = [];
                        lineArr.push(cur);
                    }

                    if (ind === arr.length - 1)
                    {
                        prev.push(lineArr.join(" "));
                    }

                    return prev;
                }, []);

                const svgText = lines.map((line, ind) => {
                        let dy = ind > 0 ? 'dy="1em"' : "";
                        return `<tspan x="0" ${dy}>${line}</tspan>`;
                    }).join("");

                const svgImage = `
                    <svg width="522" height="269">
                        <style>
                            .title { fill: white; font-size: 30px; font-weight: bold;}
                        </style>
                        <g transform="translate(160 40)">
                            <text text-anchor="middle" class="title">${svgText}</text>
                        </g>
                    </svg>`;

                sharpBuffer = Buffer.from(svgImage);
                outputBuffer = await sharp(`${imgFolder}/wisdom-llama.png`)
                    .composite([{
                        input: sharpBuffer
                    }]).toBuffer();
            }
        } catch (e) {
            isErr = true;
            errMsg = e;
        } finally {
            if (isErr !== true)
            {
                message.channel.send({
                    content: "",
                    files: [{
                        attachment: outputBuffer
                    }]
                });
            }
            else
            {
                Utils.sendEmbed({
                    message: message,
                    isError: true,
                    title: "Wisdom Llama",
                    description: errMsg
                });
            }
        }
    }

    static xxx(message) {
        let { channel, author: { username } } = message;
        const rng = Utils.RandNum();

        let msg = "Lmao sexless";

        if (rng > 0.5) {
            msg = `Congratulations ${username}! You have a ${rng}% chance of getting SEX the following week!`;
        }
        else if (rng > 0) {
            msg = `Ouch ${username}! Looks like you only have a ${rng}% chance of getting SEX the following week!`;
        }

        channel.send(msg);
    } 

    static currentTrack(message) {
        let { channel: { guild } } = message;
        let voiceConnection = Distube.voices.collection.find(x => x.id == guild.id);

        if (voiceConnection === undefined) {
            message.channel.send("I'm not in a voice channel.");
            return;
        }

        const queue = Distube.getQueue(guild.id);

        if (queue === undefined) {
            message.channel.send("Queue not found.");
            return;
        }

        if (queue.songs.length <= 0) {
            message.channel.send("No song is currently playing.");
            return;
        }

        const curSong = queue.songs[0];

        const name = curSong.name;
        const duration = curSong.formattedDuration;
        const thumbnail = curSong.thumbnail;
        const playbackMs = Math.floor(voiceConnection.playbackDuration);

        let minutesNum = Math.floor(playbackMs / 60);
        let secondsNum = playbackMs - (minutesNum * 60);

        let minutes = minutesNum < 10 ? `0${minutesNum}` : minutesNum.toString();
        let seconds = secondsNum < 10 ? `0${secondsNum}` : secondsNum.toString();
        
        const desc = `${minutes}:${seconds} / ${duration}`;

        Utils.sendEmbed({
            message: message,
            title: name,
            description: desc,
            thumbnail: thumbnail
        });
    }

    static replayPrevTrack(message) {
        let { channel, member } = message;

        if (Utils.PreviousSong === undefined)
        {
            channel.send("There is no song to replay :(");
            return;
        }

        Distube.play(member.voice.channel, Utils.PreviousSong, {
            member: member,
            textChannel: channel
        });
    }

    static async createReminder(message, commands) {
        if (message.author === undefined) return;
        commands.shift();

        const invalidEmbed = {
            message: message,
            title: "Reminder",
            description: "Commands: {dd/mm/yyyy}, daily, weekly"
        };

        if (commands.length <= 0) {
            Utils.sendEmbed(invalidEmbed);
            return;
        }

        const frequencyStr = commands[0];
        commands.shift();

        let modelFrequency = Utils.Reminder_Frequency_Single;
        let lastMessageDate = "";
        let remindDate = "";

        switch (frequencyStr)
        {
            case "daily":
                modelFrequency = Utils.Reminder_Frequency_Daily;
                lastMessageDate = moment().format("MM/DD/YYYY");
                break;
            case "weekly":
                modelFrequency = Utils.Reminder_Frequency_Weekly;

                if (commands[0].startsWith("-"))
                {
                    const supposedDay = commands[0].substring(1).toLowerCase();
                    const listOfDays = days.filter(d => d.startsWith(supposedDay));

                    if (listOfDays.length <= 0 || listOfDays.length > 1)
                    {
                        invalidEmbed.description = "Please insert a proper day :(";
                        Utils.sendEmbed(invalidEmbed);
                        return;
                    }

                    const day = listOfDays[0];
                    const todayMoment = moment();
                    const reminderDayMoment = moment().day(day);

                    const actualMoment = todayMoment.day() === reminderDayMoment.day()
                        ? todayMoment
                        : reminderDayMoment;

                    lastMessageDate = actualMoment.format("MM/DD/YYYY");
                    commands.shift();
                }
                else
                {
                    lastMessageDate = moment().format("MM/DD/YYYY");
                }
                break;
            default:
                let dateMoment = moment(frequencyStr, "DD/MM/YYYY");

                if (!dateMoment.isValid())
                {
                    // Tomorrow
                    if (dateMoment.invalidAt() < 0)
                    {
                        dateMoment = moment().add(1, 'day');
                        commands.unshift(frequencyStr);
                    }
                    // Attempted date
                    else
                    {
                        invalidEmbed.description = "Invalid date, the format is DD/MM/YYYY";
                        Utils.sendEmbed(invalidEmbed);
                        return;
                    }
                }

                if (dateMoment.isSameOrBefore(new moment(), 'day'))
                {
                    invalidEmbed.description = "Date has to be after today :(";
                    Utils.sendEmbed(invalidEmbed);
                    return;
                }

                remindDate = dateMoment.format("MM/DD/YYYY");
                break;
        }

        const remindMessage = commands.join(" ");

        if (remindMessage === undefined || remindMessage === null || remindMessage?.length <= 0)
        {
            invalidEmbed.description = "Message cannot be empty :(";
            Utils.sendEmbed(invalidEmbed);
            return;
        }

        const userId = message.author.id;

        const existingReminder = await reminderModel.findOne({ UserId: userId, Frequency: modelFrequency, Message: remindMessage });
        if (existingReminder !== null)
        {
            invalidEmbed.description = "Reminder already exists :(";
            Utils.sendEmbed(invalidEmbed);
            return;
        }

        let modelObj = {
            UserId: userId,
            Frequency: modelFrequency,
            Message: remindMessage,
        };

        if (remindDate.length > 0) modelObj.RemindDate = remindDate;
        if (lastMessageDate.length > 0) modelObj.LastMessageDate = lastMessageDate;
    
        const newReminder = new reminderModel(modelObj);
        newReminder.save();

        message.channel.send(`Reminder added! I will do my best to remind you around 9:00AM GMT+8!`);
    }

    // Helper functions
    static songRemoveErrorHandler(queue, message, queueRemoveIndex) {
        let title = "Song Remove";
        let description = "Cannot remove song: ";
        let isError = false;

        if (queue == undefined || queue.songs.length <= 0) {
            description += "queue is empty";
            isError = true;
        } else if (queueRemoveIndex > queue.songs.length) {
            description += "INDEX OUT OF BOUNDS EXCEPTION REEEEEEE";
            isError = true;
        }

        if (isError) {
            Utils.sendEmbed({
                message: message,
                title: title,
                description: description
            });
        }

        return isError;
    }

    static toggleQueuePause(isPause, queue) {
        if (isPause && !queue.paused) {
            Distube.pause(queue);
        } else if (!isPause && queue.paused) {
            Distube.resume(queue);
        }
    }
}