import R6API from 'r6api.js';
import * as Covid from 'novelcovid';
import moment from 'moment-timezone';
import fs from 'fs';
import path from 'path';

//import { refreshLocalMusicFiles } from './local.js';
import { distube as Distube } from './setup.js';
import config from './config.js';
import Commands from './commands.js';
import Handlers from './handlers.js';
import { wikihow } from './wikihow.js';
import TicTacToe from './tictactoe.js';
import "./extension.js";
import { RepeatMode } from 'distube';
import { MessageActionRow, MessageButton } from 'discord.js';

const r6api = new R6API({ email: config.r6apiEmail, password: config.r6apiPassword });

export default class EventManager {
    constructor() {}

    // Command List Action
    static sendCommandList(message) {
        let description = "";
        let filteredDictionaries = Commands.dictionaries.filter(x => x.Description.length > 0);

        filteredDictionaries.forEach((dictionary) => {
            description += `${dictionary.Command.join(", ")}: ${dictionary.Description}\n`;
        });

        Handlers.sendEmbed({
            message: message,
            title: "Command List",
            description: description
        });
    }

    // Greeting Actions
    static sendGreeting(message) {
        let rng = Math.random();
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
            Handlers.sendEmbed({
                message: message,
                title: countryData.name,
                description: "Cases / Deaths / Recovered",
                thumbnail: countryData.flag,
                fields: new Array({ name: 'Today', value: `${todayData.cases} / ${todayData.deaths} / ${todayData.recovered}` }, { name: 'Yesterday', value: `${yesterdayData.cases} / ${yesterdayData.deaths} / ${yesterdayData.recovered}` })
            });
        });
    }

    // Local Music Actions
    static async playLocalMusic(message, commands) {
        commands.shift();
        let fileIndex = commands[0];
        let musicIDList = [];
        let songList = [];

        if (fileIndex.toLowerCase() == "refresh") {
            refreshLocalMusicFiles();
        } else if (fileIndex == "random" || !Number.isNaN(fileIndex)) {
            let musicTxt = path.resolve(process.cwd(), "./txt/music.txt");
            var data = fs.readFileSync(musicTxt).toString();
            songList = data.split("\n");

            if (fileIndex == "random") {
                fileIndex = Math.floor(Math.random() * songList.length) + 1;
            } else {
                fileIndex -= 1;
            }

            musicIDList.push(fileIndex);
        } else {
            Handlers.sendEmbed({
                message: message,
                isError: true,
                title: "Queue",
                description: "Invalid command"
            });
        }

        if (musicIDList.length > 0) {
            for (var i = 0; i < musicIDList.length; ++i) {
                let musicID = musicIDList[i];

                if (musicID < songList.length) {
                    await Distube.play(message, `${songList[musicID]} audio only`).then(() => {
                        let queue = Distube.queues.get(message);
                        let song = queue.songs[queue.songs.length - 1];
                        let msgAuthor = message.author;

                        Handlers.sendEmbed({
                            message: message,
                            title: song.name,
                            description: "",
                            author: `${msgAuthor.username} Queued`,
                            authorIcon: msgAuthor.avatarURL({ dynamic: true }),
                            footer: ` | ${song.formattedDuration}`,
                            footerIcon: config.embedPauseIconURL
                        });
                    });
                } else {
                    Handlers.sendEmbed({
                        message: message,
                        isError: true,
                        title: "Song Not Found",
                        description: `There is only a total of ${songList.length} songs in the directory`
                    });
                }
            }
        }
    }

    // Music Actions
    static playMusic(message, commands) {
        if (message.member.voice.channel == null) return;

        commands.shift();
        Distube.play(message, commands.join(" ")).then(() => {
            let queue = Distube.queues.get(message);

            if (queue != undefined && queue.songs.length > 1) {
                let song = queue.songs[queue.songs.length - 1];
                let msgAuthor = message.author;
                Handlers.sendEmbed({
                    message: message,
                    author: `${msgAuthor.username} Queued`,
                    authorIcon: msgAuthor.avatarURL({ dynamic: true }),
                    title: song.name,
                    footer: ` | ${song.formattedDuration}`,
                    footerIcon: config.embedPauseIconURL
                });
            }
        });
    }

    static removeMusic(message, commands) {
        let queueRemoveIndex = parseInt(commands[1]);
        let queue = Distube.queues.get(message);
        let isError = this.songRemoveErrorHandler(queue, message, queueRemoveIndex);

        if (isError) return;

        --queueRemoveIndex;
        let song = queue.songs[queueRemoveIndex];
        queue.songs.splice(queueRemoveIndex, 1);

        Handlers.sendEmbed({
            message: message,
            title: "Song Removed",
            Description: song.name
        });
    }

    static sendGuildQueue(message, command) {
        if (command != "q" && command != "queue") return;

        let queue = Distube.queues.get(message);

        let description = queue == undefined || queue.songs.length == 0 ? "No tracks in queue!" :
            queue.songs.map((song, index) => {
                return `${index + 1}. ${song.name}`;
            }).join("\n");

        Handlers.sendEmbed({
            message: message,
            title: "Queue",
            description: description
        });
    }

    static joinOrLeaveVC(message, command, userChannel) {
        let queue = Distube.queues.get(message);
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
        let queue = Distube.queues.get(message);
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
                message.react('👍');
                break;
            case "stop":
                Distube.stop(queue);
                break;
            case "clear":
                if (queue.songs.length > 0) {
                    queue.songs = [];

                    Handlers.sendEmbed({
                        message: message,
                        title: "Queue Cleared",
                    });
                }
                break;
            case "loop":
                let repeatMode = queue.repeatMode == RepeatMode.DISABLED ? RepeatMode.SONG : RepeatMode.DISABLED;
                let message = queue.repeatMode == RepeatMode.DISABLED ? "Looping current track" : "Loop disabled";

                Distube.setRepeatMode(queue, repeatMode);

                Handlers.sendEmbed({
                    message: message,
                    title: "Queue Loop",
                });

                break;
        }
    }

    static setQueueFilter(message, commands) {
        if (typeof(commands) == 'string') return;

        let allowedCommands = Commands.distubeFilterList.concat("list", "ls");
        commands.shift();
        let command = commands[0];

        if (commands.length > 1 || !allowedCommands.includes(command)) {
            Handlers.sendEmbed({
                message: message,
                isError: true,
                title: "Queue Filter",
                description: "Invalid command"
            });
        } else {
            if (command == "list" || command == "ls") {
                let description = Commands.distubeFilterList.join("\n");
                Handlers.sendEmbed({
                    message: message,
                    title: "Queue Filter List",
                    description: description
                });
            } else {
                let queue = Distube.queues.get(message);

                if (!queue || !queue.playing) {
                    Handlers.sendEmbed({
                        message: message,
                        isError: true,
                        title: "Queue Filter",
                        description: "No song playing"
                    });
                    return;
                }

                Distube.setFilter(queue, command);

                let description = queue.filters == command ?
                    `Queue Filter ${command} disabled` :
                    `Queue Filter ${command} enabled`;

                Handlers.sendEmbed({
                    message: message,
                    title: "Queue Filter",
                    description: description
                });

                console.log(`${description} by ${message.author.username}`)
            }
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
        let otherPlayer = Handlers.getUserIdFromMention(commands[1]);

        if (otherPlayer === config.botId) {
            message.channel.send("I'm touched but I cannot play Tic-Tac-Toe :(");
            return;
        }

        if (player === otherPlayer) {
            Handlers.sendEmbed({
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
            Handlers.sendEmbed({
                message: message,
                isError: true,
                title: "Tic-Tac-Toe",
                description: "Only one game with the same player at a time allowed"
            });
            return;
        }

        let game = TicTacToe.allGames.find(x => x._id == gameId);
        let gameMessage = game.createOrUpdateMessage();

        message.channel.send(gameMessage).then((msg) => {
            msg.react("↖");
            msg.react("⬆");
            msg.react("↗");

            msg.react("⬅");
            msg.react("⏺");
            msg.react("➡");

            msg.react("↙");
            msg.react("⬇");
            msg.react("↘");
            msg.react("❌").then((r) => {
                let m = r.message.content.replace("[Please wait for the reactions...]\n\n", "");
                m += `\n${game._player1Username}'s turn`;
                r.message.edit({
                    content: m
                });
                game._messageId = r.message.id;
            });
        });
    }

    static updateTicTacToe(reaction, user) {
        let message = reaction.message;
        let game = TicTacToe.allGames.find(x => x._messageId == message.id);
        if (game == null) return;
        if (game._player1 != user.id && game._player2 != user.id) return;

        let reactedEmoji = reaction._emoji.name;
        if (game._emojiList.includes(reactedEmoji)) return;

        if (reactedEmoji == "❌") {
            TicTacToe.cancelMatch(game);
            let gameMessage = game.createOrUpdateMessage();
            message.edit({
                content: gameMessage + "\nMatch Cancelled".ToBold()
            });
            return;
        }

        let isPlayer1 = game._player1 == user.id;

        if ((game._playerTurn == 1 && !isPlayer1) ||
            (game._playerTurn == 2 && isPlayer1)) {
            reaction.users.remove(user);
            return;
        }

        game._emojiList.push(reactedEmoji);
        let gameMessage = game.createOrUpdateMessage();

        message.edit({
            content: gameMessage
        }).then((msg) => {
            game.endOfRoundAction(msg);
        });
    }

    // R6 functions
    static async updateR6Stats(username, platform, currentSeason, isNext) {
        let { r6user, selectedPlatform, platformText, statsFound } = await this.findR6Stats(username, platform);

        // If stats doesn't exist
        if (!statsFound) {
            return Handlers.createEmbed({
                isError: true,
                title: "R6 Stats",
                description: `Unable to find statistics for ${username}`
            });
        }

        let currentSeasonId = config.r6SeasonReferences.find(x => x.operation == currentSeason).id;
        let newSeasonId = isNext ? currentSeasonId + 1 : currentSeasonId - 1;
        let seasons = [newSeasonId - 1, newSeasonId, newSeasonId + 1];

        let id = r6user[0].id;
        let stats = await r6api.getStats(selectedPlatform, id);
        let level = (await r6api.getProgression(selectedPlatform, id))[0].level;
        let ranks = await r6api.getRanks(selectedPlatform, id, { seasonIds: seasons });

        let r6Stats = this.scrapeR6Stats(r6user[0], stats, level, ranks);
        let newStats = r6Stats.length >= 2 ? r6Stats[1] : r6Stats[0];
        let allNewSeasonIds = r6Stats.map(x => Number(x.seasonId));

        const row = new MessageActionRow().addComponents(
            new MessageButton()
            .setCustomId("previousR6Season")
            .setLabel("<")
            .setStyle("PRIMARY")
            .setDisabled(!allNewSeasonIds.includes(seasons[0])),
            new MessageButton()
            .setCustomId("nextR6Season")
            .setLabel(">")
            .setStyle("PRIMARY")
            .setDisabled(!allNewSeasonIds.includes(seasons[2]))
        );

        return Handlers.createEmbed({
            title: `Operation ${newStats.seasonName}`,
            description: `${"Level:".ToBold()} ${newStats.level}\n${"MMR:".ToBold()} ${newStats.seasonMMR}`,
            author: `${username} [${platformText}]`,
            authorIcon: newStats.avatarURL,
            thumbnail: newStats.seasonRankURL,
            fields: new Array({ name: "Overall", value: `WR: ${newStats.overallWR}%\nKD: ${newStats.overallKD}`, inline: true }, { name: 'Casual', value: `WR: ${newStats.casualWR}%\nKD: ${newStats.casualKD}`, inline: true }, { name: 'Ranked', value: `WR: ${newStats.rankedWR}%\nKD: ${newStats.rankedKD}`, inline: true }, { name: 'Season', value: `WR: ${newStats.seasonWR}%\nKD: ${newStats.seasonKD}` }),
            components: row
        });
    }

    static async retrieveR6Stats(message, commands) {
        // Attempt retrieve message
        let sentMessage = await message.channel.send("Attempting to retrieve, please wait...");

        let username = commands[1];

        let { r6user, selectedPlatform, platformText, statsFound } = await this.findR6Stats(username, null);

        // If stats doesn't exist
        if (!statsFound) {
            Handlers.sendEmbed({
                message: sentMessage,
                isEdit: true,
                isError: true,
                title: "R6 Stats",
                description: `Unable to find statistics for ${username}`
            });
            return;
        }

        let id = r6user[0].id;
        let stats = await r6api.getStats(selectedPlatform, id);
        let level = (await r6api.getProgression(selectedPlatform, id))[0].level;
        let ranks = await r6api.getRanks(selectedPlatform, id, { seasonIds: 'all' });

        let r6Stats = this.scrapeR6Stats(r6user[0], stats, level, ranks);
        let latestStats = r6Stats[r6Stats.length - 1];

        const row = new MessageActionRow().addComponents(
            new MessageButton()
            .setCustomId("previousR6Season")
            .setLabel("<")
            .setStyle("PRIMARY")
            .setDisabled(r6Stats.length - 2 < 0),
            new MessageButton()
            .setCustomId("nextR6Season")
            .setLabel(">")
            .setStyle("PRIMARY")
            .setDisabled(true)
        );

        Handlers.sendEmbed({
            message: sentMessage,
            isEdit: true,
            title: `Operation ${latestStats.seasonName}`,
            description: `${"Level:".ToBold()} ${latestStats.level}\n${"MMR:".ToBold()} ${latestStats.seasonMMR}`,
            author: `${username} [${platformText}]`,
            authorIcon: latestStats.avatarURL,
            thumbnail: latestStats.seasonRankURL,
            fields: new Array({ name: "Overall", value: `WR: ${latestStats.overallWR}%\nKD: ${latestStats.overallKD}`, inline: true }, { name: 'Casual', value: `WR: ${latestStats.casualWR}%\nKD: ${latestStats.casualKD}`, inline: true }, { name: 'Ranked', value: `WR: ${latestStats.rankedWR}%\nKD: ${latestStats.rankedKD}`, inline: true }, { name: 'Season', value: `WR: ${latestStats.seasonWR}%\nKD: ${latestStats.seasonKD}` }),
            components: row
        });
    }

    static sunbreakCountdown(message) {
        let sunbreakRelease = moment("20220831");
        let difference = sunbreakRelease.diff(moment(), 'days');

        if (difference < 0) return;

        let description = difference == 0 ?
            "TODAY" : difference == 1 ?
            "TOMORROW" : `${difference} days and counting...`;

        Handlers.sendEmbed({
            message: message,
            title: "Monster Hunter Rise: Sunbreak",
            embedURL: "https://www.monsterhunter.com/rise-sunbreak/en-uk/",
            embedImage: "http://cdn.capcom-unity.com/2021/09/MHR_Sunbreak_TeaserArt-1024x576.jpg",
            fields: new Array({ name: 'Release Date', value: `${sunbreakRelease.format("DD/MM/YYYY")} (Estimate)`, inline: true }, { name: 'Countdown', value: description, inline: true }),
            setTimestamp: true
        });
    }

    static createRhombus(message, commands) {
        commands.shift();
        if (Number.isNaN(commands[0])) return;

        let rhombusSize = Number(commands[0]);

        if (rhombusSize <= 0) {
            Handlers.sendEmbed({
                message: message,
                title: "Rhombus",
                description: "Rhombus must have a size! HOW YOU FINNA MAKE A RHOMBUS WITH NO SIZE??????"
            });
            return;
        }

        if (rhombusSize == 1) {
            Handlers.sendEmbed({
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
            Handlers.sendEmbed({
                message: message,
                isError: true,
                title: "WikiHow",
                description: "Empty query"
            });
            return;
        }

        wikihow(commands.join(" ")).then((data) => {
            if (data == null) {
                Handlers.sendEmbed({
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

    static animalCrossingUpdateCountdown(message) {
        let rng = Math.random();

        if (rng <= 0.5) {
            let updateRelease = moment("20211105");
            let difference = updateRelease.diff(moment(), 'days');

            if (difference < 0) return;

            let description = difference == 0 ?
                "TODAY" : difference == 1 ?
                "TOMORROW" : `${difference} days and counting...`;

            Handlers.sendEmbed({
                message: message,
                title: "Animal Crossing: New Horizons Title Update 2.0",
                embedURL: "https://animal-crossing.com/new-horizons/",
                embedImage: "https://i.imgur.com/fPkV0Rd.jpg",
                fields: new Array({ name: 'Release Date', value: updateRelease.format("DD/MM/YYYY"), inline: true }, { name: 'Countdown', value: description, inline: true }),
                setTimestamp: true
            });
        } else {
            if (message.member.voice.channel == null) return;

            Distube.play(message, "maroon 5 animals lyrics");
        }
    }

    // Helper functions
    static async findR6Stats(username, predefinedPlatform) {
        let platforms = new Array("uplay", "xbl", "psn");
        let platformTexts = new Array("PC", "XBOX", "PS");

        let r6user;
        let selectedPlatform = platforms.includes(predefinedPlatform) ? predefinedPlatform : "";
        let platformText = platformTexts.includes(predefinedPlatform) ? predefinedPlatform : "";
        let statsFound = false;

        if (selectedPlatform.length > 0) {
            r6user = await r6api.findByUsername(selectedPlatform, username);
            platformText = platformTexts[platforms.indexOf(platform)];
            statsFound = r6user.length > 0;
        } else if (platformText.length > 0) {
            selectedPlatform = platforms[platformTexts.indexOf(platformText)];
            r6user = await r6api.findByUsername(selectedPlatform, username);
            statsFound = r6user.length > 0;
        } else {
            // Attempt find username
            for (const platform of platforms) {
                try {
                    r6user = await r6api.findByUsername(platform, username);

                    if (r6user.length > 0) {
                        selectedPlatform = platform;
                        platformText = platformTexts[platforms.indexOf(platform)];
                        statsFound = true;
                        break;
                    }
                } catch (e) {
                    statsFound = false;
                }
            }
        }

        return { r6user, selectedPlatform, platformText, statsFound };
    }

    static scrapeR6Stats(r6user, stats, level, ranks) {
        let userId = r6user.id;
        let userAvatarURL = r6user.avatar['500'];
        let seasons = typeof(ranks[0].seasons) == 'object' ? ranks[0].seasons : ranks[0].seasons[ranks[0].seasons.length - 1];
        let pvpStats = stats[0].pvp;

        let overallWR = this.getRatio(pvpStats.general.wins, pvpStats.general.wins + pvpStats.general.losses, true).toFixed(2);
        let overallKD = this.getRatio(pvpStats.general.kills, pvpStats.general.deaths, false).toFixed(2);
        let casualWR = this.getRatio(pvpStats.queues.casual.wins, pvpStats.queues.casual.wins + pvpStats.queues.casual.losses, true).toFixed(2);
        let casualKD = this.getRatio(pvpStats.queues.casual.kills, pvpStats.queues.casual.deaths, false).toFixed(2);
        let rankedWR = this.getRatio(pvpStats.queues.ranked.wins, pvpStats.queues.ranked.wins + pvpStats.queues.ranked.losses, true).toFixed(2);
        let rankedKD = this.getRatio(pvpStats.queues.ranked.kills, pvpStats.queues.ranked.deaths, false).toFixed(2);

        let allSeasonStats = new Array();
        Object.keys(seasons).forEach((seasonId) => {
            let season = seasons[seasonId];
            let seasonalStats = season.regions['ncsa'].boards.pvp_ranked;
            let seasonStats = new Object({
                "id": userId,
                "avatarURL": userAvatarURL,
                "level": level,
                "seasonId": seasonId,
                "seasonName": season.seasonName,
                "seasonMMR": parseInt(seasonalStats.current.mmr).toLocaleString(),
                "seasonRankURL": seasonalStats.current.icon,
                "overallWR": overallWR,
                "overallKD": overallKD,
                "casualWR": casualWR,
                "casualKD": casualKD,
                "rankedWR": rankedWR,
                "rankedKD": rankedKD,
                "seasonWR": this.getRatio(seasonalStats.wins, seasonalStats.wins + seasonalStats.losses, true).toFixed(2),
                "seasonKD": this.getRatio(seasonalStats.kills, seasonalStats.deaths, false).toFixed(2)
            });

            allSeasonStats.push(seasonStats);
        });

        return allSeasonStats;
    }

    static getRatio(numerator, denominator, percentage) {
        let num = parseFloat(numerator);
        let den = parseFloat(denominator);

        if (num == 0 || den == 0) {
            return 0;
        }

        if (percentage) {
            return num / den * 100;
        }

        return num / den;
    }

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
            Handlers.sendEmbed({
                message: message,
                title: title,
                description: description
            });
        }

        return isError;
    }

    static toggleQueuePause(queue, isPause) {
        if (isPause && !queue.paused) {
            Distube.pause(queue);
        } else if (!isPause && queue.paused) {
            Distube.resume(queue);
        }
    }
}