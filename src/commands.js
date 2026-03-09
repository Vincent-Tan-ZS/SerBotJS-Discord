import { ChannelType } from 'discord.js';
import EventManager from './events.js';
import { client } from './setup.js';
import Utils from './utils.js';

// const musicActionResolve = (message, messageCommands) => {
//     // Check if user is in a voice channel
//     let userChannel = message.member.voice.channel;
//     if (userChannel == null) return;

//     let command = messageCommands[0];

//     switch (command) {
//         case "join":
//         case "leave":
//             EventManager.joinOrLeaveVC(message, command, userChannel);
//             break;
//         default:
//             EventManager.musicAction(message, command, userChannel);
//             break;
//     }
// }

const disconnectActionResolve = (message) => {
    if (Utils.IsOwner(message.author) !== true) return;

    const msg = `${message.member.username} called for disconnect: Logging out...`;

    Utils.Log(Utils.LogType_INFO, msg);

    message.channel.send(msg)
        .then(message => client.destroy())
        .catch(console.error);
}

export default class Commands {
    static fullDictionaries = {}; // IMPORTANT: Only used for initialization, deleted when initialization is complete
    static dictionaries = {}; // IMPORTANT: Used to resolve commands

    //MessageCommands will contain commands after "ser".
    //Example (square brackets == messageCommands): ser [play spiderman pizza theme]
    static resolveCommand(message, messageCommands) {
        let cmdsIsString = typeof(messageCommands) == 'string';
        let cmd = cmdsIsString ?
            messageCommands.toLowerCase() :
            messageCommands[0];

        let dictionary = this.dictionaries[cmd];

        if (dictionary == null || dictionary == undefined) return;
        if (message.channel.type === ChannelType.DM && !dictionary.CanDM) return;

        let commands = cmdsIsString ? [] : messageCommands.slice(1);
        dictionary.Action(message, commands);
    }

    static GenCommand = (title, commands, desc, usg, act, canDm) => {
        // Populate Full Dictionary for DB initialization
        this.fullDictionaries[title] = {
            Command: commands,
            Description: desc,
            Usage: usg,
            CanDM: canDm
        };

        // Populate Dictionary for command resolution
        commands.forEach((cmd) => {
            this.dictionaries[cmd] = {
                Action: act,
                CanDM: canDm
            };
        });
    }

    static ClearFullDictionary = () => {
        for (const key in this.fullDictionaries)
        {
            this.fullDictionaries[key] = null;
        }

        this.fullDictionaries = null;
    }

    static SetupCommands = () => {
        // const musicPlayDictionary = GenCommand("Play Song", ["p", "play"], "SerBot will play your requested song", [""], (msg, cmds) => { EventManager.playMusic(msg, cmds); }, false);
        // const musicRemoveDictionary = GenCommand("Remove Song From Queue", ["rm", "remove"], "Removes selected song from queue", [""], (msg, cmds) => { EventManager.removeMusic(msg, cmds); }, false);
        // const musicJoinDictionary = GenCommand("Join Voice Channel", ["join"], "Joins your voice channel", [""], musicActionResolve, false)
        // const musicPauseDictionary = GenCommand("Pause Song", ["pause"], "Pause the music player", [""], musicActionResolve, false);
        // const musicResumeDictionary = GenCommand("Resume Song", ["resume"], "Resume the music player", [""], musicActionResolve, false);
        // const musicSkipDictionary = GenCommand("Skip Current Song", ["skip"], "Skip the current song", [""], musicActionResolve, false);
        // const musicStopDictionary = GenCommand("Stop Current Song", ["stop"], "Stops the current song", [""], musicActionResolve, false);
        // const musicLeaveDictionary = GenCommand("Leave Voice Channel", ["leave"], "Leaves the current voice channel", [""], musicActionResolve, false);
        // const musicQueueDictionary = GenCommand("Display Song Queue", ["q", "queue"], "Display the song queue", [""], (msg, cmds) => { EventManager.sendGuildQueue(msg, cmds); }, false);
        // const musicClearDictionary = GenCommand("Clear Queue", ["clr", "clear"], "Clears current queue", [""], musicActionResolve, false);
        // const musicLoopDictionary = GenCommand("Loop Current Song", ["l", "loop"], "Loops/Unloops the current track", [""], musicActionResolve, false);
        // const trackDictionary = GenCommand("Current Track", ["track", "song"], "Displays information about current song", [""], (msg) => { EventManager.currentTrack(msg) }, false);
        // const replayDictionary = GenCommand("Replay Previous Song", ["replay"], "Replays the previous song (if applicable)", [""], (msg) => { EventManager.replayPrevTrack(msg) }, false);
        // const pListDictionary = GenCommand("Play user song list", ["plist", "playlist"], "Plays a user's playlist, either in its entirety or any song", ["", "random", "{id}"], (msg, cmds) => { EventManager.playUserSongList(msg, cmds) }, false);
        
        this.GenCommand("Ping", ["ping"], "Ping Pong!", [""], (msg) => { EventManager.ping(msg); }, true);
        this.GenCommand("Greeting", ["hi", "hey", "hello", "sup"], "Receive a greeting from SerBot", [""], (msg) => { EventManager.sendGreeting(msg); }, true);
        this.GenCommand("Disconnect", ["dc", "disconnect", "logout"], "SerBot logs out (Owner Only)", [""], disconnectActionResolve, false);
        this.GenCommand("Rhombus", ["rhombus"], "Creates a rhombus of size n", ["{size}"], (msg, cmds) => { EventManager.createRhombus(msg, cmds); }, true);
        this.GenCommand("Today's Date", ["today"], "I'll tell you what day it is today", [""], (msg) => { EventManager.sendDay(msg); }, true);
        this.GenCommand("Tic-Tac-Toe", ["tictactoe"], "Play Tic-Tac-Toe with someone in the server!", ["@mention"], (msg, cmds) => { EventManager.playTicTacToe(msg, cmds); }, false);
        this.GenCommand("Game Copypasta", ["copypasta"], "Copypasta: mention a user and a game", ["@mention {game}"], (msg, cmds) => { EventManager.replyCopypasta(msg, cmds); }, false);
        this.GenCommand("8-Ball", ["8ball", "8b"], "8-ball lmao", [""], (msg) => { EventManager.reply8Ball(msg); }, true)
        this.GenCommand("Coin Flip", ["coin", "coinflip"], "Does a random coin flip", ["", "{number of times}"], (msg, cmds) => { EventManager.coinFlip(msg, cmds); }, true);
        this.GenCommand("Random Wheel", ["wheel"], "Does a wheel spin (randomizer)", ["{option1, option2, etc}", "{option1, option2, etc} {number of times}"], (msg, cmds) => { EventManager.wheel(msg, cmds); }, true);
        this.GenCommand("Display A Tree", ["tree"], "Generate a tree :)", [""], (msg) => { EventManager.tree(msg); }, true);
        this.GenCommand("American Psycho", ["psycho"], "Let's see Paul Allen's card", ["", "card"], (msg, cmds) => { EventManager.psycho(msg, cmds); }, true);
        this.GenCommand("Countdown", ["countdown", "cd"], "Create/view Countdowns!", ["list", "create", "update", "delete", "{countdown}"], (msg, cmds) => { EventManager.countdown(msg, cmds) }, true);
        this.GenCommand("Wisdom Llama", ["wisdom"], "Generate a Wisdom Llama image", ["{text}"], (msg, cmds) => { EventManager.wisdomLlama(msg, cmds) }, true);
        this.GenCommand("xxx", ["sex"], "Tell your fortune in terms of SEX in the following week", [""], (msg) => { EventManager.xxx(msg) }, true);
        this.GenCommand("Create a Reminder for you", ["remind"], "Set a reminder for you, either a set date, or daily/weekly!", ["{dd/mm/yyyy} {message}", "{message} (auto-remind to tomorrow)", "daily {message}", "weekly {message}", "weekly [day] {message}"], (msg, cmds) => { EventManager.createReminder(msg, cmds) }, true);
        this.GenCommand("Authorization Code", ["auth"], "Generates a random authorization code to be used on SerBot's Site!", [""], (msg) => { EventManager.genAuthCode(msg) }, true);
        this.GenCommand("Report Bot Issues", ["report"], "Report any issues with SerBot to the owner", ["{issue}"], (msg, cmds) => { EventManager.reportIssue(msg, cmds) }, false);
        this.GenCommand("Feature Update", ["feature"], "Add a feature to the Feature Update database (Owner Only)", ["[type] {message}"], (msg, cmds) => { EventManager.addFeatureUpdate(msg, cmds) }, true);
        this.GenCommand("Cap or no cap", ["cap"], "Tells you cap or no cap", [""], (msg) => { EventManager.capOrNoCap(msg) }, true);
        this.GenCommand("Meals", ["chef"], "Lists all meals and the steps to make them", ["", "meal", "meal {id}", "meal random", "meal {filter text}"], (msg, cmds) => { EventManager.chef(msg, cmds) }, true);
    
        this.GenCommand("Help List", ["help"], "Show the list of commands", [""], (msg) => { EventManager.sendCommandList(msg); }, true);
    }
}