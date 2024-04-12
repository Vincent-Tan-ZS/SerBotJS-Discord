import EventManager from './events.js';
import { client } from './setup.js';
import Utils from './utils.js';

const GenCommand = (title, cmd, desc, usg, act) => {
    return { Title: title, Command: cmd, Description: desc, Usage: usg, Action: act }; 
}

export default class Commands {
    //#region Functions
    musicActionResolve(message, messageCommands) {
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

    disconnectActionResolve(message) {
        if (Utils.IsOwner(message.author) !== true) return;

        const msg = `${message.member.username} called for disconnect: Logging out...`;

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

        let dictionary = dictionaries.find(x => x.Command.includes(cmd));

        if (dictionary == null || dictionary == undefined) return;

        let commands = typeof(messageCommands) == 'string' ? [messageCommands] :
            messageCommands;

        dictionary.Action(message, commands);
    }

    static SetupCommands = () => {
        const pingDictionary = GenCommand("Ping", ["ping"], "Ping Pong!", [""], (msg) => { EventManager.ping(msg); });
        const greetingDictionary = GenCommand("Greeting", ["hi", "hey", "hello", "sup"], "Receive a greeting from SerBot", [""], (msg) => { EventManager.sendGreeting(msg); });
        const musicPlayDictionary = GenCommand("Play Song", ["p", "play"], "SerBot will play your requested song", [""], (msg, cmds) => { EventManager.playMusic(msg, cmds); });
        const musicRemoveDictionary = GenCommand("Remove Song From Queue", ["rm", "remove"], "Removes selected song from queue", [""], (msg, cmds) => { EventManager.removeMusic(msg, cmds); });
        const musicJoinDictionary = GenCommand("Join Voice Channel", ["join"], "Joins your voice channel", [""], this.musicActionResolve)
        const musicPauseDictionary = GenCommand("Pause Song", ["pause"], "Pause the music player", [""], this.musicActionResolve);
        const musicResumeDictionary = GenCommand("Resume Song", ["resume"], "Resume the music player", [""], this.musicActionResolve);
        const musicSkipDictionary = GenCommand("Skip Current Song", ["skip"], "Skip the current song", [""], this.musicActionResolve);
        const musicStopDictionary = GenCommand("Stop Current Song", ["stop"], "Stops the current song", [""], this.musicActionResolve);
        const musicLeaveDictionary = GenCommand("Leave Voice Channel", ["leave"], "Leaves the current voice channel", [""], this.musicActionResolve);
        const musicQueueDictionary = GenCommand("Display Song Queue", ["q", "queue"], "Display the song queue", [""], (msg, cmds) => { EventManager.sendGuildQueue(msg, cmds); });
        const musicClearDictionary = GenCommand("Clear Queue", ["clr", "clear"], "Clears current queue", [""], this.musicActionResolve);
        const musicLoopDictionary = GenCommand("Loop Current Song", ["l", "loop"], "Loops/Unloops the current track", [""], this.musicActionResolve);
        const disconnectDictionary = GenCommand("Disconnect", ["dc", "disconnect", "logout"], "SerBot logs out (Owner Only)", [""], this.disconnectActionResolve);
        const rhombusDictionary = GenCommand("Rhombus", ["rhombus"], "Creates a rhombus of size n", ["{size}"], (msg, cmds) => { EventManager.createRhombus(msg, cmds); });
        const wikiHowDictionary = GenCommand("Wikihow Article", ["wikihow"], "Searches for a WikiHow page", ["{search term}"], (msg, cmds) => { EventManager.searchWikiHow(msg, cmds); });
        const todayDictionary = GenCommand("Today's Date", ["today"], "I'll tell you what day it is today", [""], (msg) => { EventManager.sendDay(msg); });
        const tictactoeDictionary = GenCommand("Tic-Tac-Toe", ["tictactoe"], "Play Tic-Tac-Toe with someone in the server!", ["@mention"], (msg, cmds) => { EventManager.playTicTacToe(msg, cmds); });
        const copypastaDictionary = GenCommand("Game Copypasta", ["copypasta"], "Copypasta: mention a user and a game", ["@mention {game}"], (msg, cmds) => { EventManager.replyCopypasta(msg, cmds); });
        const _8ballDictionary = GenCommand("8-Ball", ["8ball", "8b"], "8-ball lmao", [""], (msg) => { EventManager.reply8Ball(msg); })
        const coinFlipDictionary = GenCommand("Coin Flip", ["coin", "coinflip"], "Does a random coin flip", [""], (msg) => { EventManager.coinFlip(msg); });
        const wheelDictionary = GenCommand("Random Wheel", ["wheel"], "Does a wheel spin (randomizer)", ["{option1, option2, etc}"], (msg, cmds) => { EventManager.wheel(msg, cmds); });
        const treeDictionary = GenCommand("Display A Tree", ["tree"], "Generate a tree :)", [""], (msg) => { EventManager.tree(msg); });
        const psychoDictionary = GenCommand("American Psycho", ["psycho"], "Let's see Paul Allen's card", ["", "card"], (msg, cmds) => { EventManager.psycho(msg, cmds); });
        const countdownDictionary = GenCommand("Countdown", ["countdown", "cd"], "Create/view Countdowns!", ["list", "create", "update", "delete", "{countdown}"], (msg, cmds) => { EventManager.countdown(msg, cmds) });
        const wisdomDictionary = GenCommand("Wisdom Llama", ["wisdom"], "Generate a Wisdom Llama image", ["{text}"], (msg, cmds) => { EventManager.wisdomLlama(msg, cmds) });
        const xxxDictionary = GenCommand("xxx", ["sex"], "Tell your fortune in terms of SEX in the following week", [""], (msg) => { EventManager.xxx(msg) });
        const trackDictionary = GenCommand("Current Track", ["track", "song"], "Displays information about current song", [""], (msg) => { EventManager.currentTrack(msg) });
        const replayDictionary = GenCommand("Replay Previous Song", ["replay"], "Replays the previous song (if applicable)", [""], (msg) => { EventManager.replayPrevTrack(msg) });
        const reminderDictionary = GenCommand("Create a Reminder for you", ["remind"], "Set a reminder for you, either a set date, or daily/weekly!", ["{dd/mm/yyyy} {message}", "{message} (auto-remind to tomorrow)", "daily {message}", "weekly {message}", "weekly [day] {message}"], (msg, cmds) => { EventManager.createReminder(msg, cmds) });
        const authDictionary = GenCommand("Authorization Code", ["auth"], "Generates a random authorization code to be used on SerBot's Site!", [""], (msg) => { EventManager.genAuthCode(msg) });
        const pListDictionary = GenCommand("Play user song list", ["plist", "playlist"], "Plays a user's playlist, either in its entirety or any song", ["", "random", "{id}"], (msg, cmds) => { EventManager.playUserSongList(msg, cmds) });
        const reportDictionary = GenCommand("Report Bot Issues", ["report"], "Report any issues with SerBot to the owner", ["{issue}"], (msg, cmds) => { EventManager.reportIssue(msg, cmds) });
        const featureUpdateDictionary = GenCommand("Feature Update", ["feature"], "Add a feature to the Feature Update database (Owner Only)", ["{type} {message}"], (msg, cmds) => { EventManager.addFeatureUpdate(msg, cmds) });
    
        const helpDictionary = GenCommand("Help List", ["help"], "Show the list of commands", [""], (msg) => { EventManager.sendCommandList(msg); });

        return [greetingDictionary, musicJoinDictionary, musicPlayDictionary, musicPauseDictionary,
            musicResumeDictionary, musicSkipDictionary, musicStopDictionary, musicLeaveDictionary, musicQueueDictionary,
            musicRemoveDictionary, musicClearDictionary, musicLoopDictionary,
            disconnectDictionary, rhombusDictionary, wikiHowDictionary, helpDictionary,
            todayDictionary, tictactoeDictionary, wisdomDictionary, xxxDictionary,
            trackDictionary, replayDictionary, reminderDictionary, authDictionary, pListDictionary, reportDictionary, featureUpdateDictionary,
            copypastaDictionary, _8ballDictionary, coinFlipDictionary, wheelDictionary, treeDictionary, psychoDictionary,
            countdownDictionary, pingDictionary];
    }
    //#endregion Functions

    static dictionaries = this.SetupCommands();
}