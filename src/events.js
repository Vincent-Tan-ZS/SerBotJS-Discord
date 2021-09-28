import R6API from 'r6api.js';
import * as Covid from 'novelcovid';
import moment from 'moment';
import { refreshLocalMusicFiles } from './local.js';

import { distube as Distube } from './setup.js';
import config from './config.js';
import Commands from './commands.js';
import Handlers from './handlers.js';

const r6api = new R6API.default({ email: config.r6apiEmail, password: config.r6apiPassword });

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

        if (fileIndex.toLowerCase() == "refresh") {
            refreshLocalMusicFiles();
        } else if (fileIndex == "random" || typeof(fileIndex) == Number) {
            if (fileIndex == "random") {
                fileIndex = Math.floor(Math.random() * musicFiles.length) + 1;
            }

            var fs = require('fs');
            let musicTxt = path.resolve(process.cwd(), "./txt/music.txt");
            var data = fs.readFileSync(musicTxt).toString();

            let songName = data.split("\n")[fileIndex];
            musicIDList.push(songName);
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

                if (musicID < musicFiles.length) {
                    await Distube.play(message, `${musicFiles[musicID]} audio only`).then(() => {
                        let queue = Distube.getQueue(message);
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
                        description: `There is only a total of ${musicFiles.length} songs in the directory`
                    });
                }
            }
        }
    }

    // Music Actions
    static playMusic(message, commands) {
        commands.shift();
        Distube.play(message, commands.join(" ")).then(() => {
            let queue = Distube.getQueue(message);

            if (queue != undefined) {
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
        let queue = Distube.getQueue(message);
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

    static musicAction(voiceConnection, message, command) {
        let queue = Distube.getQueue(message);

        switch (command) {
            case "join":
                if (voiceConnection == null) {
                    let authorChannel = message.member.voice.channel;
                    if (authorChannel != null) {
                        authorChannel.join();
                    }
                }
                break;
            case "pause":
                if (!Distube.isPaused) {
                    Distube.pause(message);
                }
                break;
            case "resume":
                if (Distube.isPaused) {
                    Distube.resume(message);
                }
                break;
            case "skip":
                Distube.skip(message);
                message.react('👍');
                break;
            case "stop":
                Distube.stop(message);
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
            case "leave":
                if (voiceConnection != null) {
                    if (Distube.isPlaying(message)) {
                        Distube.stop(message);
                    }
                    voiceConnection.disconnect()
                }
                break;
            case "q":
            case "queue":
                let description = queue == undefined || queue.songs.length == 0 ? "No tracks in queue!" :
                    queue.songs.map((song, index) => {
                        return `${index + 1}. ${song.name}`;
                    }).join("\n");

                Handlers.sendEmbed({
                    message: message,
                    title: "Queue",
                    description: description
                });
                break;
        }
    }

    static setQueueFilter(message, commands) {
        if (!Distube.isPlaying(message)) {
            Handlers.sendEmbed({
                message: message,
                isError: true,
                title: "Queue Filter",
                description: "No song playing"
            });
            return;
        }

        let allowedCommands = Commands.distubeFilterList.concat("list", "ls");
        commands.shift();
        let command = commands[0];

        let embed = Handlers.createErrorEmbed("Queue Filter", "Invalid command");

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
                Distube.setFilter(message, command);

                let description = Distube.filters == command ?
                    `Queue Filter ${command} disabled` :
                    `Queue Filter ${command} enabled`;

                Handlers.sendEmbed({
                    message: message,
                    title: "Queue Filter",
                    description: description
                });

                console.log(`${description} by ${message.author.username}`)
            }
            message.channel.send(embed);
        }
    }

    // R6 functions
    static async retrieveR6Stats(message, commands) {
        let username = commands[1];
        let platforms = new Array("uplay", "xbl", "psn");
        let selectedPlatform;
        let platformTexts = new Array("PC", "XBOX", "PS");
        let platformText;
        let r6user;
        let statsFound = false;

        // Attempt retrieve message
        let sentMessage = await message.channel.send("Attempting to retrieve, please wait...");

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
        let ranks = await r6api.getRanks(selectedPlatform, id);

        let r6Stats = this.scrapeR6Stats(r6user[0], stats, level, ranks);

        Handlers.sendEmbed({
            message: sentMessage,
            title: `Operation ${r6Stats.seasonName}`,
            description: `**Level:** ${r6Stats.level}\n**MMR:** ${r6Stats.seasonMMR}`,
            author: `${username} [${platformText}]`,
            authorIcon: r6Stats.avatarURL,
            thumbnail: r6Stats.seasonRankURL,
            fields: new Array({ name: '**Overall**', value: `WR: ${r6Stats.overallWR}%\nKD: ${r6Stats.overallKD}`, inline: true }, { name: '**Casual**', value: `WR: ${r6Stats.casualWR}%\nKD: ${r6Stats.casualKD}`, inline: true }, { name: '**Ranked**', value: `WR: ${r6Stats.rankedWR}%\nKD: ${r6Stats.rankedKD}`, inline: true }, { name: '**Season**', value: `WR: ${r6Stats.seasonWR}%\nKD: ${r6Stats.seasonKD}` })
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

    // Helper functions
    static scrapeR6Stats(r6user, stats, level, ranks) {
        let userId = r6user.id;
        let userAvatarURL = r6user.avatar['500'];
        let seasons = typeof(ranks[0].seasons) == 'object' ? ranks[0].seasons : ranks[0].seasons[ranks[0].seasons.length - 1];
        let seasonId = Object.keys(seasons).sort()[0];
        let season = seasons[seasonId];
        let seasonalStats = season.regions['ncsa'].boards.pvp_ranked;
        let pvpStats = stats[0].pvp;

        return Object({
            "id": userId,
            "avatarURL": userAvatarURL,
            "level": level,
            "seasonName": season.seasonName || config.currentR6Season,
            "seasonMMR": parseInt(seasonalStats.current.mmr).toLocaleString(),
            "seasonRankURL": seasonalStats.current.icon,
            "overallWR": this.getRatio(pvpStats.general.wins, pvpStats.general.wins + pvpStats.general.losses, true).toFixed(2),
            "overallKD": this.getRatio(pvpStats.general.kills, pvpStats.general.deaths, false).toFixed(2),
            "casualWR": this.getRatio(pvpStats.queues.casual.wins, pvpStats.queues.casual.wins + pvpStats.queues.casual.losses, true).toFixed(2),
            "casualKD": this.getRatio(pvpStats.queues.casual.kills, pvpStats.queues.casual.deaths, false).toFixed(2),
            "rankedWR": this.getRatio(pvpStats.queues.ranked.wins, pvpStats.queues.ranked.wins + pvpStats.queues.ranked.losses, true).toFixed(2),
            "rankedKD": this.getRatio(pvpStats.queues.ranked.kills, pvpStats.queues.ranked.deaths, false).toFixed(2),
            "seasonWR": this.getRatio(seasonalStats.wins, seasonalStats.wins + seasonalStats.losses, true).toFixed(2),
            "seasonKD": this.getRatio(seasonalStats.kills, seasonalStats.deaths, false).toFixed(2),
        });
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
}