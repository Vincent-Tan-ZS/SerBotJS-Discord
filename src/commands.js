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
    static pingCommands = new Array("ping");
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
    static musicLoopCommands = new Array("l", "loop");
    static r6Commands = new Array("r6");
    static localMusicCommands = new Array("music");
    static covidCommands = new Array("covid");
    static rhombusCommands = new Array("rhombus");
    static wikiHowCommands = new Array("wikihow");
    static todayCommands = new Array("today");
    static tictactoeCommands = new Array("tictactoe");
    static copypastaCommands = new Array("copypasta");
    static _8ballCommands = new Array("8ball", "8b");
    static coinFlipCommands = new Array("coin", "coinflip");
    static wheelCommands = new Array("wheel");
    static treeCommands = new Array("tree");
    static psychoCommands = new Array("psycho");
    static tierListCommands = new Array("tierlist", "tl");
    //#endregion Commands

    //#region Commands Description
    static pingDescription = "Ping Pong!";
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
    static musicLoopDescription = "Loops/Unloops the current track";
    static r6Description = "Display Rainbow Six: Siege player stats [Commands: 'r6 {username}']";
    static covidDescription = "Retrieves information on Covid-19 cases for a country [Commands: 'covid {country}']";
    static rhombusDescription = "Creates a rhombus of size n [Commands: 'rhombus {size}']";
    static wikiHowDescription = "Searches for a WikiHow page [Commands: 'wikihow {search}']";
    static todayDescription = "I'll tell you what day it is today";
    static tictactoeDescription = "Play Tic-Tac-Toe with someone in the server! [Commands: 'tictactoe @mention']";
    static copypastaDescription = "Copypasta: mention a user and a game [Commands: 'copypasta @mention {game}']";
    static _8ballDescription = "8-ball lmao";
    static coinFlipDescription = "Does a random coin flip";
    static wheelDescription = "Does a wheel spin (randomizer) [Commands: 'wheel {option1, option2, option3, etc.}']";
    static treeDescription = "Generate a tree :)";
    static psychoDescription = "Let's see Paul Allen's card [Commands: 'psycho', 'psycho card']";
    static tierListDescription = "Create/view Tier Lists! [Commands: 'create', 'view {name}', 'delete {name}']";
    //#endregion Commands Description

    //#region Dictionary
    static pingDictionary = new Command(this.pingCommands, this.pingDescription, (msg) => { EventManager.ping(msg); });
    static greetingDictionary = new Command(this.greetingCommands, this.greetingDescription, (msg) => { EventManager.sendGreeting(msg); });
    static musicPlayDictionary = new Command(this.musicPlayCommands, this.musicPlayDescription, (msg, cmds) => { EventManager.playMusic(msg, cmds); });
    static musicRemoveDictionary = new Command(this.musicRemoveCommands, this.musicRemoveDescription, (msg, cmds) => { EventManager.removeMusic(msg, cmds); });
    static musicJoinDictionary = new Command(this.musicJoinCommands, this.musicJoinDescription, this.musicActionResolve)
    static musicPauseDictionary = new Command(this.musicPauseCommands, this.musicPauseDescription, this.musicActionResolve);
    static musicResumeDictionary = new Command(this.musicResumeCommands, this.musicResumeDescription, this.musicActionResolve);
    static musicSkipDictionary = new Command(this.musicSkipCommands, this.musicSkipDescription, this.musicActionResolve);
    static musicStopDictionary = new Command(this.musicStopCommands, this.musicStopDescription, this.musicActionResolve);
    static musicLeaveDictionary = new Command(this.musicLeaveCommands, this.musicLeaveDescription, this.musicActionResolve);
    static musicQueueDictionary = new Command(this.musicQueueCommands, this.musicQueueDescription, (msg, cmds) => { EventManager.sendGuildQueue(msg, cmds); });
    static musicClearDictionary = new Command(this.musicClearCommands, this.musicClearDescription, this.musicActionResolve);
    static musicLoopDictionary = new Command(this.musicLoopCommands, this.musicLoopDescription, this.musicActionResolve);
    static disconnectDictionary = new Command(this.disconnectCommands, this.disconnectDescription, this.disconnectActionResolve);
    static r6Dictionary = new Command(this.r6Commands, this.r6Description, (msg, cmds) => { EventManager.retrieveR6Stats(msg, cmds); });
    static covidDictionary = new Command(this.covidCommands, this.covidDescription, (msg, cmds) => { EventManager.getCovidCases(msg, cmds); });
    static rhombusDictionary = new Command(this.rhombusCommands, this.rhombusDescription, (msg, cmds) => { EventManager.createRhombus(msg, cmds); });
    static wikiHowDictionary = new Command(this.wikiHowCommands, this.wikiHowDescription, (msg, cmds) => { EventManager.searchWikiHow(msg, cmds); });
    static todayDictionary = new Command(this.todayCommands, this.todayDescription, (msg) => { EventManager.sendDay(msg); });
    static tictactoeDictionary = new Command(this.tictactoeCommands, this.tictactoeDescription, (msg, cmds) => { EventManager.playTicTacToe(msg, cmds); });
    static copypastaDictionary = new Command(this.copypastaCommands, this.copypastaDescription, (msg, cmds) => { EventManager.replyCopypasta(msg, cmds); });
    static _8ballDictionary = new Command(this._8ballCommands, this._8ballDescription, (msg) => { EventManager.reply8Ball(msg); })
    static coinFlipDictionary = new Command(this.coinFlipCommands, this.coinFlipDescription, (msg) => { EventManager.coinFlip(msg); });
    static wheelDictionary = new Command(this.wheelCommands, this.wheelDescription, (msg, cmds) => { EventManager.wheel(msg, cmds); });
    static treeDictionary = new Command(this.treeCommands, this.treeDescription, (msg) => { EventManager.tree(msg); });
    static psychoDictionary = new Command(this.psychoCommands, this.psychoDescription, (msg, cmds) => { EventManager.psycho(msg, cmds); });
    static tierListDictionary = new Command(this.tierListCommands, this.tierListDescription, (msg, cmds) => { EventManager.tierList(msg, cmds) });

    static helpDictionary = new Command(this.helpCommands, "", (msg) => { EventManager.sendCommandList(msg); });
    static localMusicDictionary = new Command(this.localMusicCommands, "", (msg, cmds) => { EventManager.playLocalMusic(msg, cmds); });
    //#endregion Dictionary

    //#region DictionaryList
    static dictionaries = new Array(this.greetingDictionary, this.musicJoinDictionary, this.musicPlayDictionary, this.musicPauseDictionary,
        this.musicResumeDictionary, this.musicSkipDictionary, this.musicStopDictionary, this.musicLeaveDictionary, this.musicQueueDictionary,
        this.musicRemoveDictionary, this.musicClearDictionary, this.musicLoopDictionary, this.r6Dictionary,
        this.covidDictionary, this.disconnectDictionary, this.rhombusDictionary, this.wikiHowDictionary, this.helpDictionary,
        this.localMusicDictionary, this.todayDictionary, this.tictactoeDictionary, this.tierListDictionary,
        this.copypastaDictionary, this._8ballDictionary, this.coinFlipDictionary, this.wheelDictionary, this.treeDictionary, this.psychoDictionary,
        this.pingDictionary);
    //#endregion DictionaryList

    //#region Functions
    static musicActionResolve(message, messageCommands) {
        // Check if user is in a voice channel
        let userChannel = message.member.voice.channel;
        if (userChannel == null) return;

        let command = messageCommands[0];

        switch (command) {
            case "join":
            case "leave":
                EventManager.joinOrLeaveVC(message, command, userChannel);
                break;
            default:
                EventManager.musicAction(message, command, userChannel);
                break;
        }
    }

    static disconnectActionResolve(message) {
        if (!message.member.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR)) return;

        message.channel.send("Logging out...")
            .then(message => client.destroy())
            .catch(console.error);
    }

    //MessageCommands will contain commands after "ser".
    //Example (square brackets == messageCommands): ser [play spiderman pizza theme]
    static resolveCommand(message, messageCommands) {
        let cmd = typeof(messageCommands) == 'string' ?
            messageCommands.toLowerCase() :
            messageCommands[0];

        let dictionary = this.dictionaries.find(x => x.Command.includes(cmd));

        if (dictionary == null || dictionary == undefined) return;

        let commands = typeof(messageCommands) == 'string' ? [messageCommands] :
            messageCommands;

        dictionary.Action(message, commands);
    }

    //#endregion Functions
}