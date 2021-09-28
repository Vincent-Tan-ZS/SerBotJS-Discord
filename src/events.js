import R6API from 'r6api.js';
import * as Covid from 'novelcovid';
import moment from 'moment';
import Discord from 'discord.js';

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

        let embed = Handlers.createBasicEmbed("Command List", description);
        message.channel.send(embed);
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
            let embed = Handlers.createBasicEmbed(countryData.name, "Cases / Deaths / Recovered");
            embed.setThumbnail(countryData.flag)
                .addFields({ name: 'Today', value: `${todayData.cases} / ${todayData.deaths} / ${todayData.recovered}` }, { name: 'Yesterday', value: `${yesterdayData.cases} / ${yesterdayData.deaths} / ${yesterdayData.recovered}` });
            message.channel.send(embed);
        });
    }

    // Local Music Actions
    static async playLocalMusic(message, commands) {
        commands.shift();
        let fileIndex = commands[0];

        var fs = require('fs');
        var files = fs.readdirSync("C:/Users/vintz/Downloads/Music");
        var musicFiles = files.filter(x => x.toLowerCase().substring(x.length - 4).includes(".mp3")).map(x => x.substr(0, x.lastIndexOf(".mp3")));

        let embed = Handlers.createErrorEmbed("Song Not Found", `There is only a total of ${musicFiles.length} songs in the directory`);

        let musicIDList = [];

        if (fileIndex.toLowerCase() == "random") {
            fileIndex = Math.floor(Math.random() * musicFiles.length) + 1;
            musicIDList.push(fileIndex);
        } else if (fileIndex.toLowerCase() == "random10") {
            while (musicIDList.length < 10) {
                let newRandomId = Math.floor(Math.random() * musicFiles.length) + 1;
                if (!musicIDList.includes(newRandomId)) {
                    musicIDList.push(newRandomId);
                }
            }
        } else {
            fileIndex = Number(fileIndex) - 1;
            musicIDList.push(fileIndex);
        }

        if (musicIDList.length > 0) {
            for (var i = 0; i < musicIDList.length; ++i) {
                let musicID = musicIDList[i];

                if (musicID < musicFiles.length) {
                    await Distube.play(message, `${musicFiles[musicID]} audio only`).then(() => {
                        let queue = Distube.getQueue(message);
                        let song = queue.songs[queue.songs.length - 1];
                        let msgAuthor = message.author;
                        embed = new Discord.MessageEmbed()
                            .setAuthor(`${msgAuthor.username} Queued`, msgAuthor.avatarURL({ dynamic: true }))
                            .setTitle(song.name)
                            .setColor(config.embedColor)
                            .setFooter(` | ${song.formattedDuration}`, config.embedPauseIconURL);
                        message.channel.send(embed);
                    });
                } else {
                    message.channel.send(embed);
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
                let embed = new Discord.MessageEmbed()
                    .setAuthor(`${msgAuthor.username} Queued`, msgAuthor.avatarURL({ dynamic: true }))
                    .setTitle(song.name)
                    .setColor(config.embedColor)
                    .setFooter(` | ${song.formattedDuration}`, config.embedPauseIconURL);
                message.channel.send(embed);
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

        let embed = Handlers.createBasicEmbed("Song Removed", song.name);
        message.channel.send(embed);
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

                    let embed = new Discord.MessageEmbed()
                        .setTitle("Queue Cleared")
                        .setColor(config.embedColor);
                    message.channel.send(embed);
                }
                break;
            case "leave":
                if (voiceConnection != null) {
                    if (Distube.isPlaying("Is Playing")) {
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

                let embed = Handlers.createBasicEmbed("Queue", description);
                message.channel.send(embed);
                break;
        }
    }

    static setQueueFilter(message, commands) {
        if (!Distube.isPlaying(message)) {
            message.channel.send(Handlers.createErrorEmbed("Queue Filter", "No song playing"));
            return;
        }

        let allowedCommands = Commands.distubeFilterList.concat("list", "ls");
        commands.shift();
        let command = commands[0];

        let embed = Handlers.createErrorEmbed("Queue Filter", "Invalid command");

        if (commands.length > 1 || !allowedCommands.includes(command)) {
            message.channel.send(embed);
        } else {
            if (command == "list" || command == "ls") {
                let description = Commands.distubeFilterList.join("\n");
                embed = Handlers.createBasicEmbed("Queue Filter List", description);
            } else {
                Distube.setFilter(message, command);

                let description = Distube.filters == command ?
                    `Queue Filter ${command} disabled` :
                    `Queue Filter ${command} enabled`;

                embed = Handlers.createBasicEmbed("Queue Filter", description);
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
            let embed = Handlers.createErrorEmbed("R6 Stats", `Unable to find statistics for ${username}`)
            sentMessage.edit("", embed);
            return;
        }

        let id = r6user[0].id;
        let stats = await r6api.getStats(selectedPlatform, id);
        let level = (await r6api.getProgression(selectedPlatform, id))[0].level;
        let ranks = await r6api.getRanks(selectedPlatform, id);

        let r6Stats = this.scrapeR6Stats(r6user[0], stats, level, ranks);

        let embed = Handlers.createBasicEmbed(`Operation: ${r6Stats.seasonName}`, `**Level:** ${r6Stats.level}\n**MMR:** ${r6Stats.seasonMMR}`);

        embed.setAuthor(`${username} [${platformText}]`, r6Stats.avatarURL)
            .setThumbnail(r6Stats.seasonRankURL)
            .addFields({ name: '**Overall**', value: `WR: ${r6Stats.overallWR}%\nKD: ${r6Stats.overallKD}`, inline: true }, { name: '**Casual**', value: `WR: ${r6Stats.casualWR}%\nKD: ${r6Stats.casualKD}`, inline: true }, { name: '**Ranked**', value: `WR: ${r6Stats.rankedWR}%\nKD: ${r6Stats.rankedKD}`, inline: true }, { name: '**Season**', value: `WR: ${r6Stats.seasonWR}%\nKD: ${r6Stats.seasonKD}` });
        sentMessage.edit("", embed);
    }

    static sunbreakCountdown(message) {
        let sunbreakRelease = moment("20220831");
        let difference = sunbreakRelease.diff(moment(), 'days');

        let description = difference > 1 ?
            `${difference} days and counting...` :
            `${difference} day left`;

        let embed = Handlers.createBasicEmbed("Monster Hunter Rise: Sunbreak", "");

        embed
            .setURL("https://www.monsterhunter.com/rise-sunbreak/en-uk/")
            .addFields({ name: 'Release Date', value: `${sunbreakRelease.format("DD/MM/YYYY")} (Estimate)`, inline: true }, { name: 'Countdown', value: description, inline: true })
            .setImage("http://cdn.capcom-unity.com/2021/09/MHR_Sunbreak_TeaserArt-1024x576.jpg")
            .setTimestamp();

        message.channel.send(embed);
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
            let embed = Handlers.createErrorEmbed(title, description);
            message.channel.send(embed);
        }

        return isError;
    }
}