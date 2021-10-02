import Discord from 'discord.js';
import EventManager from './events.js';
import { client } from './setup.js';

class Command {
    constructor(cmd, desc, act) {
        this.Command = cmd;
        this.Description = desc;
        this.Action = act;
    }
}

export default class Commands {
    constructor() {}

    //#region Commands
    static disconnectCommands = new Array("dc", "disconnect", "logout");
    static greetingCommands = new Array("hi", "hey", "hello", "sup");
    static helpCommands = new Array("help");
    static musicJoinCommands = new Array("join");
    static musicPlayCommands = new Array("p", "play");
    static musicPauseCommands = new Array("pause");
    static musicResumeCommands = new Array("resume");
    static musicSkipCommands = new Array("skip");
    static musicStopCommands = new Array("stop");
    static musicLeaveCommands = new Array("leave");
    static musicRemoveCommands = new Array("rm", "remove");
    static musicClearCommands = new Array("clr", "clear");
    static musicQueueCommands = new Array("q", "queue");
    static musicFilterCommands = new Array("f", "filter");
    static r6Commands = new Array("r6");
    static localMusicCommands = new Array("music");
    static covidCommands = new Array("covid");
    static sunbreakCommands = new Array("sunbreak");
    static rhombusCommands = new Array("rhombus");
    static wikiHowCommands = new Array("wikihow");
    //#endregion Commands

    //#region Commands Description
    static disconnectDescription = "SerBot logs out (Administrators Only)";
    static greetingDescription = "Receive a greeting from SerBot";
    static musicJoinDescription = "Joins your voice channel";
    static musicPlayDescription = "SerBot will play your requested song";
    static musicPauseDescription = "Pause the music player";
    static musicResumeDescription = "Resume the music player";
    static musicSkipDescription = "Skip the current song";
    static musicStopDescription = "Stops the current song";
    static musicLeaveDescription = "Leaves the current voice channel";
    static musicRemoveDescription = "Removes selected song from queue";
    static musicClearDescription = "Clears current queue";
    static musicQueueDescription = "Display the song queue";
    static musicFilterDescription = "Filters the song queue (replays current song)";
    static r6Description = "Display Rainbow Six: Siege player stats";
    static covidDescription = "Retrieves information on Covid-19 cases for a country";
    static rhombusDescription = "Creates a rhombus of size n";
    static wikiHowDescription = "Searches for a WikiHow page";
    //#endregion Commands Description

    //#region Dictionary
    static greetingDictionary = new Command(this.greetingCommands, this.greetingDescription, (msg) => { EventManager.sendGreeting(msg); });
    static musicPlayDictionary = new Command(this.musicPlayCommands, this.musicPlayDescription, (msg, cmds) => { EventManager.playMusic(msg, cmds); });
    static musicRemoveDictionary = new Command(this.musicRemoveCommands, this.musicRemoveDescription, (msg, cmds) => { EventManager.removeMusic(msg, cmds); });
    static musicFilterDictionary = new Command(this.musicFilterCommands, this.musicFilterDescription, (msg, cmds) => { EventManager.setQueueFilter(msg, cmds); });
    static musicJoinDictionary = new Command(this.musicJoinCommands, this.musicJoinDescription, this.musicActionResolve)
    static musicPauseDictionary = new Command(this.musicPauseCommands, this.musicPauseDescription, this.musicActionResolve);
    static musicResumeDictionary = new Command(this.musicResumeCommands, this.musicResumeDescription, this.musicActionResolve);
    static musicSkipDictionary = new Command(this.musicSkipCommands, this.musicSkipDescription, this.musicActionResolve);
    static musicStopDictionary = new Command(this.musicStopCommands, this.musicStopDescription, this.musicActionResolve);
    static musicLeaveDictionary = new Command(this.musicLeaveCommands, this.musicLeaveDescription, this.musicActionResolve);
    static musicQueueDictionary = new Command(this.musicQueueCommands, this.musicQueueDescription, (msg, cmds) => { EventManager.sendGuildQueue(msg, cmds); });
    static musicClearDictionary = new Command(this.musicClearCommands, this.musicClearDescription, this.musicActionResolve);
    static disconnectDictionary = new Command(this.disconnectCommands, this.disconnectDescription, this.disconnectActionResolve);
    static r6Dictionary = new Command(this.r6Commands, this.r6Description, (msg, cmds) => { EventManager.retrieveR6Stats(msg, cmds); });
    static covidDictionary = new Command(this.covidCommands, this.covidDescription, (msg, cmds) => { EventManager.getCovidCases(msg, cmds); });
    static rhombusDictionary = new Command(this.rhombusCommands, this.rhombusDescription, (msg, cmds) => { EventManager.createRhombus(msg, cmds); });
    static wikiHowDictionary = new Command(this.wikiHowCommands, this.wikiHowDescription, (msg, cmds) => { EventManager.searchWikiHow(msg, cmds); });

    static helpDictionary = new Command(this.helpCommands, "", (msg) => { EventManager.sendCommandList(msg); });
    static localMusicDictionary = new Command(this.localMusicCommands, "", (msg, cmds) => { EventManager.playLocalMusic(msg, cmds); });
    static sunbreakDictionary = new Command(this.sunbreakCommands, "", (msg) => { EventManager.sunbreakCountdown(msg); });

    //#endregion Dictionary

    //#region DictionaryList
    static dictionaries = new Array(this.greetingDictionary, this.musicJoinDictionary, this.musicPlayDictionary, this.musicPauseDictionary,
        this.musicResumeDictionary, this.musicSkipDictionary, this.musicStopDictionary, this.musicLeaveDictionary, this.musicQueueDictionary,
        this.musicFilterDictionary, this.musicRemoveDictionary, this.musicClearDictionary, this.r6Dictionary, this.covidDictionary,
        this.disconnectDictionary, this.rhombusDictionary, this.wikiHowDictionary, this.helpDictionary, this.localMusicDictionary,
        this.sunbreakDictionary);
    //#endregion DictionaryList

    //#region Others
    static distubeFilterList = new Array("3d", "bassboost", "echo", "karoke", "nightcore", "vaporwave", "flanger", "gate", "haas", "reverse", "surround", "mcompand", "phaser", "tremolo", "earwax");
    //#endregion Others

    //#region Functions
    static musicActionResolve(message, messageCommands) {
        // Check if user is in a voice channel
        let userChannel = message.member.voice.channel;
        if (userChannel == null) return;

        EventManager.musicAction(message, messageCommands, userChannel);
    }

    static disconnectActionResolve(message) {
        if (!message.member.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR)) return;

        message.channel.send("Logging out...")
            .then(message => client.destroy())
            .catch(console.error);
    }

    static resolveCommand(message, messageCommands) {
        let cmd = typeof(messageCommands) == 'string' ?
            messageCommands.toLowerCase() :
            messageCommands[0];

        let dictionary = this.dictionaries.find(x => x.Command.includes(cmd));

        if (dictionary == null || dictionary == undefined) return;

        dictionary.Action(message, messageCommands);
    }

    //#endreigon Functions
}