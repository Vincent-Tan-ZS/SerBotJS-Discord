class Commands {
    constructor() {}

    // Commands
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
    static musicRemoveCommands = new Array("rm");
    static musicQueueCommands = new Array("q", "queue");
    static r6Commands = new Array("r6");

    // Commands Description
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
    static musicQueueDescription = "Display the song queue";
    static r6Description = "Display Rainbow Six: Siege player stats";

    // Dictionary
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
    static disconnectDictionary = { Command: this.disconnectCommands, Description: this.disconnectDescription };
    static r6Dictionary = { Command: this.r6Commands, Description: this.r6Description };

    // Dictionary List
    static dictionaries = new Array(this.greetingDictionary, this.musicJoinDictionary, this.musicPlayDictionary, this.musicPauseDictionary,
        this.musicResumeDictionary, this.musicSkipDictionary, this.musicStopDictionary, this.musicLeaveDictionary, this.musicQueueDictionary,
        this.musicRemoveDictionary, this.r6Dictionary, this.disconnectDictionary);
}

module.exports = Commands