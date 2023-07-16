import mongoose from "mongoose";
import Utils from "../utils.js";

export const ConnectDB = async() => {
    Utils.Log(Utils.LogType_INFO, "Connecting to MongoDB", "Database");

    try
    {
        await mongoose.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority`, {
                keepAlive: true,
                dbName: "SerBot"
            }
        );

        Utils.Log(Utils.LogType_INFO, "Connected to MongoDB");
    }
    catch (e)
    {
        Utils.Log(Utils.LogType_ERROR, `Failed to Connect to MongoDB: ${e.message}`, "Database");
    }
}