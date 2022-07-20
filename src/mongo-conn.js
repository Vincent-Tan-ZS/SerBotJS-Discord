import mongoose from "mongoose";

export const ConnectDB = async() => {
    await mongoose.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority`, {
            keepAlive: true,
            dbName: "SerBot"
        }
    );
}

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

export { tierListUserMappingModel, tierListModel };