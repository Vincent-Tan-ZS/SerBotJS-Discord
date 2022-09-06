import mongoose from "mongoose";

// Tier List
const tierListUserMappingSchema = mongoose.Schema({
    UserId: {
        type: String,
        required: true
    },
    TierListId: {
        type: String,
        required: true
    }
});
const tierListUserMappingModel = mongoose.model('TierListUserMapping', tierListUserMappingSchema, 'TierListUserMapping');

const subTierListSchema = mongoose.Schema({
    Tier: {
        type: String,
        required: true
    },
    Data: {
        type: String,
        required: true
    }
});

const tierListSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Tiers: {
        type: Array,
        required: true,
    },
    List: [subTierListSchema]
});
const tierListModel = mongoose.model('TierList', tierListSchema, 'TierList');

// Countdown
const countdownSchema = mongoose.Schema({
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

export { tierListUserMappingModel, tierListModel, countdownModel, loggingModel };