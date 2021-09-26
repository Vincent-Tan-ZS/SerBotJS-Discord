class Commands {
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
    //#endregion Commands Description

    //#region Dictionary
    static greetingDictionary = { Command: this.greetingCommands, Description: this.greetingDescription };
    static musicJoinDictionary = { Command: this.musicJoinCommands, Description: this.musicJoinDescription }
    static musicPlayDictionary = { Command: this.musicPlayCommands, Description: this.musicPlayDescription };
    static musicPauseDictionary = { Command: this.musicPauseCommands, Description: this.musicPauseDescription };
    static musicResumeDictionary = { Command: this.musicResumeCommands, Description: this.musicResumeDescription };
    static musicSkipDictionary = { Command: this.musicSkipCommands, Description: this.musicSkipDescription };
    static musicStopDictionary = { Command: this.musicStopCommands, Description: this.musicStopDescription };
    static musicLeaveDictionary = { Command: this.musicLeaveCommands, Description: this.musicLeaveDescription };
    static musicRemoveDictionary = { Command: this.musicRemoveCommands, Description: this.musicRemoveDescription };
    static musicQueueDictionary = { Command: this.musicQueueCommands, Description: this.musicQueueDescription };
    static musicFilterDictionary = { Command: this.musicFilterCommands, Description: this.musicFilterDescription };
    static musicClearDictionary = { Command: this.musicClearCommands, Description: this.musicClearDescription };
    static disconnectDictionary = { Command: this.disconnectCommands, Description: this.disconnectDescription };
    static r6Dictionary = { Command: this.r6Commands, Description: this.r6Description };
    static covidDictionary = { Command: this.covidCommands, Description: this.covidDescription }
        //#endregion Dictionary

    //#region DictionaryList
    static dictionaries = new Array(this.greetingDictionary, this.musicJoinDictionary, this.musicPlayDictionary, this.musicPauseDictionary,
        this.musicResumeDictionary, this.musicSkipDictionary, this.musicStopDictionary, this.musicLeaveDictionary, this.musicQueueDictionary,
        this.musicFilterDictionary, this.musicRemoveDictionary, this.musicClearDictionary, this.r6Dictionary, this.covidDictionary,
        this.disconnectDictionary);
    //#endregion DictionaryList

    //#region Others
    static distubeFilterList = new Array("3d", "bassboost", "echo", "karoke", "nightcore", "vaporwave", "flanger", "gate", "haas", "reverse", "surround", "mcompand", "phaser", "tremolo", "earwax");
    //#endregion Others
}

module.exports = Commands