import mongoose from "mongoose";

// Countdown
const countdownSchema = mongoose.Schema({
    Id: {
        type: Number,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        required: true
    },
    Description: {
        type: String
    },
    Image: {
        type: String
    },
    URL: {
        type: String
    },
    UserId: {
        type: String,
        required: true
    }
});
const countdownModel = mongoose.model('Countdown', countdownSchema, 'Countdown');

// Logging
const loggingSchema = mongoose.Schema({
    Timestamp: {
        type: Date,
        required: true
    },
    Type: {
        type: String,
        required: true,
    },
    LogType: {
        type: String,
        required: true,
    },
    Message: {
        type: String,
        required: true
    }
});
const loggingModel = mongoose.model('Logging', loggingSchema, 'Logging');

// Commands
const commandSchema = mongoose.Schema({
    Title: {
        type: String,
        required: true
    },
    List: {
        type: Array,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Usage: {
        type: Array,
        required: true
    }
});
const commandModel = mongoose.model('Commands', commandSchema, 'Commands');

// Reminder
const reminderSchema = mongoose.Schema({
    UserId: {
        type: String,
        required: true
    },
    Frequency: {
        type: Number,
        required: true
    },
    // Used only for Single Frequency
    RemindDate: {
        type: Date,
        required: false
    },
    Message: {
        type: String,
        required: true
    },
    LastMessageDate: {
        type: Date,
        required: false
    }
});
const reminderModel = mongoose.model('Reminders', reminderSchema, 'Reminders');

// Site Authorization
const siteAuthorizationSchema = mongoose.Schema({
    UserId: {
        type: String,
        required: true
    },
    UserName: {
        type: String,
        required: true
    },
    AuthCode: {
        type: String,
        required: true
    },
	ExpiresOn: {
		type: Date,
		require: true
	}
});
const siteAuthModel = mongoose.model('SiteAuthorization', siteAuthorizationSchema, 'SiteAuthorizations');

// UserSongList
const userSongListSchema = mongoose.Schema({
    UserId: {
        type: String,
        required: true
    },
    SongList: {
        type: Array,
        required: true
    }
});
const userSongListModel = mongoose.model('UserSongList', userSongListSchema, 'UserSongLists');

export { countdownModel, loggingModel, commandModel, reminderModel, siteAuthModel, userSongListModel };