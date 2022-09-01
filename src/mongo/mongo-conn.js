import mongoose from "mongoose";

export const ConnectDB = async() => {
    await mongoose.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority`, {
            keepAlive: true,
            dbName: "SerBot"
        }
    );
}