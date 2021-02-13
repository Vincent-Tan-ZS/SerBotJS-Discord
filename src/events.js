const R6API = require('r6api.js');
const r6api = new R6API('wicakig123@laklica.com', '321gikaciw');

class EventManager {
    constructor() {

    }

    // Determine Command Functions : boolean
    static messageIsAdmin(cmds, Discord, message) {
        let msgMember = message.member;
        if (!msgMember.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR)) return false;

        let cmd = message.content.split(' ')[1];
        return cmds.includes(cmd);
    }

    static messageIsCommandLowerCased(cmds, message) {
        let lowercaseMessage = message.toLowerCase();
        return cmds.includes(lowercaseMessage);
    }

    static messageIsCommandArray(cmds, message) {
        let msgCommand = message[0];
        return cmds.includes(msgCommand);
    }

    static messageIsMusicAction(Commands, message) {
        return Commands.musicJoinCommands.includes(message) ||
            Commands.musicPauseCommands.includes(message) ||
            Commands.musicResumeCommands.includes(message) ||
            Commands.musicSkipCommands.includes(message) ||
            Commands.musicStopCommands.includes(message) ||
            Commands.musicLeaveCommands.includes(message) ||
            Commands.musicQueueCommands.includes(message);
    }

    // Command List Action
    static sendCommandList(Discord, Commands, config, message) {
        let description = "";

        for (let i = 0; i < Commands.dictionaries.length; ++i) {
            let dictionary = Commands.dictionaries[i];
            description += `${dictionary.Command.join(", ")}: ${dictionary.Description}\n`;
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Command List")
            .setColor(config.embedColor)
            .setDescription(description);
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

    // Music Actions
    static playMusic(distube, Discord, config, message, commands) {
        commands.shift();
        distube.play(message, commands.join(" ")).then(() => {
            let queue = distube.getQueue(message);
            let song = queue.songs[queue.songs.length - 1];
            let msgAuthor = message.author;
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${msgAuthor.username} Queued`, msgAuthor.avatarURL({ dynamic: true }))
                .setTitle(song.name)
                .setColor(config.embedColor)
                .setFooter(` | ${song.formattedDuration}`, config.embedPauseIconURL);
            message.channel.send(embed);
        });
    }

    static removeMusic(distube, Discord, config, message, commands) {
        let queueRemoveIndex = parseInt(commands[1]);
        let queue = distube.getQueue(message);
        let isError = this.songRemoveErrorHandler(Discord, config, queue, message, queueRemoveIndex);

        if (isError) return;

        --queueRemoveIndex;
        let song = queue.songs[queueRemoveIndex];
        queue.songs.splice(queueRemoveIndex, 1);

        let embed = new Discord.MessageEmbed()
            .setTitle("Song Removed")
            .setColor(config.embedColor)
            .setDescription(song.name);
        message.channel.send(embed);
    }

    static musicAction(distube, Discord, config, voiceConnection, message, command) {
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
                if (!distube.isPaused) {
                    distube.pause(message);
                }
                break;
            case "resume":
                if (distube.isPaused) {
                    distube.resume(message);
                }
                break;
            case "skip":
                distube.skip(message);
                break;
            case "stop":
                distube.stop(message);
                break;
            case "leave":
                if (distube.isPlaying(message)) {
                    distube.stop(message);
                }
                if (voiceConnection != null) {
                    voiceConnection.disconnect();
                }
                break;
            case "q":
            case "queue":
                let queue = distube.getQueue(message);
                let description = queue == undefined || queue.songs.length == 0 ? "No tracks in queue!" :
                    queue.songs.map((song, index) => {
                        return `${index + 1}. ${song.name}`;
                    }).join("\n");

                let embed = new Discord.MessageEmbed()
                    .setTitle('Queue')
                    .setColor(config.embedColor)
                    .setDescription(description);

                message.channel.send(embed);
                break;
        }
    }

    // R6 functions
    static async retrieveR6Stats(Discord, config, message, channel) {
        let username = message[1];
        let platforms = new Array("uplay", "xbl", "psn");
        let platformTexts = new Array("PC", "XBOX", "PS");
        let platformText;
        let id;
        let level;
        let stats;
        let rank;
        let statsFound = false;


        channel.send("Attempting to retrieve, please wait...");
        for (let i = 0; i < platforms.length; ++i) {
            try {
                id = await r6api.getId(platforms[i], username);
                stats = await r6api.getStats(platforms[i], id[0].id);
                level = await r6api.getLevel(platforms[i], id[0].id);
                rank = await r6api.getRank(platforms[i], id[0].id);
                platformText = platformTexts[i];

                statsFound = (id.length > 0 && stats.length > 0 && level.length > 0 && rank.length > 0);
                break;
            } catch (e) {
                statsFound = false;
            }
        }

        if (!statsFound) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Error: R6 Stats")
                .setColor(config.embedColor)
                .setDescription(`Unable to find statistics for ${username}`);
            channel.send(embed);
            return;
        }

        let r6Stats = this.scrapeR6Stats(id, stats, level, rank);

        let embed = new Discord.MessageEmbed()
            .setAuthor(`${username} [${platformText}]`, r6Stats.avatarURL)
            .setTitle(`Operation: ${r6Stats.seasonName}`)
            .setColor(config.embedColor)
            .setThumbnail(r6Stats.seasonRankURL)
            .setDescription(`**Level:** ${r6Stats.level}\n**MMR:** ${r6Stats.seasonMMR}`)
            .addFields({ name: '**Overall**', value: `WR: ${r6Stats.overallWR}%\nKD: ${r6Stats.overallKD}`, inline: true }, { name: '**Casual**', value: `WR: ${r6Stats.casualWR}%\nKD: ${r6Stats.casualKD}`, inline: true }, { name: '**Ranked**', value: `WR: ${r6Stats.rankedWR}%\nKD: ${r6Stats.rankedKD}`, inline: true }, { name: '**Season**', value: `WR: ${r6Stats.seasonWR}%\nKD: ${r6Stats.seasonKD}` });
        channel.send(embed);
    }

    // Helper functions
    static scrapeR6Stats(id, stats, level, rank) {
        let userId = id[0].id;
        let userAvatarURL = `https://ubisoft-avatars.akamaized.net/${userId}/default_256_256.png`;
        let seasons = typeof(rank[0].seasons) == 'object' ? rank[0].seasons : rank[0].seasons[rank[0].seasons.length - 1];
        let seasonId = Object.keys(seasons).sort()[0];
        let season = seasons[seasonId];
        let seasonRegion = season.regions['ncsa'];
        let pvpStats = stats[0].pvp;

        return Object({
            "id": userId,
            "avatarURL": userAvatarURL,
            "level": level[0].level,
            "seasonName": season.name,
            "seasonMMR": parseInt(seasonRegion.current.mmr).toLocaleString(),
            "seasonRankURL": seasonRegion.current.image,
            "overallWR": this.getPercentage(pvpStats.general.wins, pvpStats.general.losses).toFixed(2),
            "overallKD": this.getPercentage(pvpStats.general.kills, pvpStats.general.deaths).toFixed(2),
            "casualWR": this.getPercentage(pvpStats.queue.casual.wins, pvpStats.queue.casual.losses).toFixed(2),
            "casualKD": this.getPercentage(pvpStats.queue.casual.kills, pvpStats.queue.casual.deaths).toFixed(2),
            "rankedWR": this.getPercentage(pvpStats.queue.ranked.wins, pvpStats.queue.ranked.losses).toFixed(2),
            "rankedKD": this.getPercentage(pvpStats.queue.ranked.kills, pvpStats.queue.ranked.deaths).toFixed(2),
            "seasonWR": this.getPercentage(seasonRegion.wins, seasonRegion.losses).toFixed(2),
            "seasonKD": this.getPercentage(seasonRegion.kills, seasonRegion.deaths).toFixed(2),
        });
    }

    static getPercentage(numerator, denominator) {
        let num = parseFloat(numerator);
        let den = parseFloat(denominator);

        if (num == 0 || den == 0) {
            return 0;
        }

        return num / den;
    }

    static songRemoveErrorHandler(Discord, config, queue, message, queueRemoveIndex) {
        let title = "Error: Song Remove";
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
            let embed = new Discord.MessageEmbed()
                .setTitle(title)
                .setColor(config.embedColor)
                .setDescription(description);
            message.channel.send(embed);
        }

        return isError;
    }
}

module.exports = EventManager