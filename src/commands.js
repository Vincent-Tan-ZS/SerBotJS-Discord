import Discord, {Utils} from 'discord.js';
import EventManager from './events.js';
import { client } from './setup.js';

class Command {
    constructor(title, cmd, desc, usg, act) {
        this.Title = title,
        this.Command = cmd;
        this.Description = desc;
        this.Usage = usg;
        this.Action = act;
    }
}

export default class Commands {
    constructor() {}

    //#region Title
    static pingTitle = "Ping";
    static disconnectTitle = "Disconnect";
    static greetingTitle = "Greeting";
    static helpTitle = "Help List";
    static musicJoinTitle = "Join Voice Channel";
    static musicPlayTitle = "Play Song";
    static musicPauseTitle = "Pause Song";
    static musicResumeTitle = "Resume Song";
    static musicSkipTitle = "Skip Current Song";
    static musicStopTitle = "Stop Current Song";
    static musicLeaveTitle = "Leave Voice Channel";
    static musicRemoveTitle = "Remove Song From Queue";
    static musicClearTitle = "Clear Queue";
    static musicQueueTitle = "Display Song Queue";
    static musicLoopTitle = "Loop Current Song";
    static r6Title = "Rainbow Six: Siege Player Statistics";
    static covidTitle = "Display Country's Covid Statistics";
    static rhombusTitle = "Rhombus";
    static wikiHowTitle = "Wikihow Article";
    static todayTitle = "Today's Date";
    static tictactoeTitle = "Tic-Tac-Toe";
    static copypastaTitle = "Game Copypasta";
    static _8ballTitle = "8-Ball";
    static coinFlipTitle = "Coin Flip";
    static wheelTitle = "Random Wheel";
    static treeTitle = "Display A Tree";
    static psychoTitle = "American Psycho";
    static tierListTitle = "Tier List";
    static countdownTitle = "Countdown";
    static wisdomTitle = "Wisdom Llama";

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
    static countdownCommands = new Array("countdown", "cd");
    static wisdomCommands = new Array("wisdom");
    //#endregion Commands

    //#region Commands Description
    static helpDescription = "Show the list of commands";
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
    static r6Description = "Display Rainbow Six: Siege player stats";
    static covidDescription = "Retrieves information on Covid-19 cases for a country";
    static rhombusDescription = "Creates a rhombus of size n";
    static wikiHowDescription = "Searches for a WikiHow page";
    static todayDescription = "I'll tell you what day it is today";
    static tictactoeDescription = "Play Tic-Tac-Toe with someone in the server!";
    static copypastaDescription = "Copypasta: mention a user and a game";
    static _8ballDescription = "8-ball lmao";
    static coinFlipDescription = "Does a random coin flip";
    static wheelDescription = "Does a wheel spin (randomizer)";
    static treeDescription = "Generate a tree :)";
    static psychoDescription = "Let's see Paul Allen's card";
    static tierListDescription = "Create/view Tier Lists!";
    static countdownDescription = "Create/view Countdowns!";
    static wisdomDescription = "Generate a Wisdom Llama image";
    //#endregion Commands Description

    //#region Dictionary
    static pingDictionary = new Command(this.pingTitle, this.pingCommands, this.pingDescription, [""], (msg) => { EventManager.ping(msg); });
    static greetingDictionary = new Command(this.greetingTitle, this.greetingCommands, this.greetingDescription, [""], (msg) => { EventManager.sendGreeting(msg); });
    static musicPlayDictionary = new Command(this.musicPlayTitle, this.musicPlayCommands, this.musicPlayDescription, [""], (msg, cmds) => { EventManager.playMusic(msg, cmds); });
    static musicRemoveDictionary = new Command(this.musicRemoveTitle, this.musicRemoveCommands, this.musicRemoveDescription, [""], (msg, cmds) => { EventManager.removeMusic(msg, cmds); });
    static musicJoinDictionary = new Command(this.musicJoinTitle, this.musicJoinCommands, this.musicJoinDescription, [""], this.musicActionResolve)
    static musicPauseDictionary = new Command(this.musicPauseTitle, this.musicPauseCommands, this.musicPauseDescription, [""], this.musicActionResolve);
    static musicResumeDictionary = new Command(this.musicResumeTitle, this.musicResumeCommands, this.musicResumeDescription, [""], this.musicActionResolve);
    static musicSkipDictionary = new Command(this.musicSkipTitle, this.musicSkipCommands, this.musicSkipDescription, [""], this.musicActionResolve);
    static musicStopDictionary = new Command(this.musicStopTitle, this.musicStopCommands, this.musicStopDescription, [""], this.musicActionResolve);
    static musicLeaveDictionary = new Command(this.musicLeaveTitle, this.musicLeaveCommands, this.musicLeaveDescription, [""], this.musicActionResolve);
    static musicQueueDictionary = new Command(this.musicQueueTitle, this.musicQueueCommands, this.musicQueueDescription, [""], (msg, cmds) => { EventManager.sendGuildQueue(msg, cmds); });
    static musicClearDictionary = new Command(this.musicClearTitle, this.musicClearCommands, this.musicClearDescription, [""], this.musicActionResolve);
    static musicLoopDictionary = new Command(this.musicLoopTitle, this.musicLoopCommands, this.musicLoopDescription, [""], this.musicActionResolve);
    static disconnectDictionary = new Command(this.disconnectTitle, this.disconnectCommands, this.disconnectDescription, [""], this.disconnectActionResolve);
    static r6Dictionary = new Command(this.r6Title, this.r6Commands, this.r6Description, ["{username}"], (msg, cmds) => { EventManager.retrieveR6Stats(msg, cmds); });
    static covidDictionary = new Command(this.covidTitle, this.covidCommands, this.covidDescription, ["{country}"], (msg, cmds) => { EventManager.getCovidCases(msg, cmds); });
    static rhombusDictionary = new Command(this.rhombusTitle, this.rhombusCommands, this.rhombusDescription, ["{size}"], (msg, cmds) => { EventManager.createRhombus(msg, cmds); });
    static wikiHowDictionary = new Command(this.wikiHowTitle, this.wikiHowCommands, this.wikiHowDescription, ["{search term}"], (msg, cmds) => { EventManager.searchWikiHow(msg, cmds); });
    static todayDictionary = new Command(this.todayTitle, this.todayCommands, this.todayDescription, [""], (msg) => { EventManager.sendDay(msg); });
    static tictactoeDictionary = new Command(this.tictactoeTitle, this.tictactoeCommands, this.tictactoeDescription, ["@mention"], (msg, cmds) => { EventManager.playTicTacToe(msg, cmds); });
    static copypastaDictionary = new Command(this.copypastaTitle, this.copypastaCommands, this.copypastaDescription, ["@mention {game}"], (msg, cmds) => { EventManager.replyCopypasta(msg, cmds); });
    static _8ballDictionary = new Command(this._8ballTitle, this._8ballCommands, this._8ballDescription, [""], (msg) => { EventManager.reply8Ball(msg); })
    static coinFlipDictionary = new Command(this.coinFlipTitle, this.coinFlipCommands, this.coinFlipDescription, [""], (msg) => { EventManager.coinFlip(msg); });
    static wheelDictionary = new Command(this.wheelTitle, this.wheelCommands, this.wheelDescription, ["{option1, option2, etc}"], (msg, cmds) => { EventManager.wheel(msg, cmds); });
    static treeDictionary = new Command(this.treeTitle, this.treeCommands, this.treeDescription, [""], (msg) => { EventManager.tree(msg); });
    static psychoDictionary = new Command(this.psychoTitle, this.psychoCommands, this.psychoDescription, ["", "card"], (msg, cmds) => { EventManager.psycho(msg, cmds); });
    static tierListDictionary = new Command(this.tierListTitle, this.tierListCommands, this.tierListDescription, [""], (msg, cmds) => { EventManager.tierList(msg, cmds) });
    static countdownDictionary = new Command(this.countdownTitle, this.countdownCommands, this.countdownDescription, [""], (msg, cmds) => { EventManager.countdown(msg, cmds) });
    static wisdomDictionary = new Command(this.wisdomTitle, this.wisdomCommands, this.wisdomDescription, ["{text}"], (msg, cmds) => { EventManager.wisdomLlama(msg, cmds) });

    static helpDictionary = new Command(this.helpTitle, this.helpCommands, this.helpDescription, [""], (msg) => { EventManager.sendCommandList(msg); });
    //#endregion Dictionary

    //#region DictionaryList
    static dictionaries = new Array(this.greetingDictionary, this.musicJoinDictionary, this.musicPlayDictionary, this.musicPauseDictionary,
        this.musicResumeDictionary, this.musicSkipDictionary, this.musicStopDictionary, this.musicLeaveDictionary, this.musicQueueDictionary,
        this.musicRemoveDictionary, this.musicClearDictionary, this.musicLoopDictionary, this.r6Dictionary,
        this.covidDictionary, this.disconnectDictionary, this.rhombusDictionary, this.wikiHowDictionary, this.helpDictionary,
        this.todayDictionary, this.tictactoeDictionary, this.tierListDictionary, this.wisdomDictionary,
        this.copypastaDictionary, this._8ballDictionary, this.coinFlipDictionary, this.wheelDictionary, this.treeDictionary, this.psychoDictionary,
        this.countdownDictionary, this.pingDictionary);
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
        if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return;

        const msg = `${message.member.displayName} called for disconnect: Logging out...`;

        Utils.Log(Utils.LogType_INFO, msg);

        message.channel.send(msg)
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