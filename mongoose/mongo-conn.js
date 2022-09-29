import mongoose from "mongoose";

export const ConnectDB = async() => {
    try
    {
        await mongoose.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority`, {
                keepAlive: true,
                dbName: "SerBot"
            }
        );
    }
    catch (e)
    {
		console.log(e.message);
    }
}

export const DisconnectDB = async() => {
	await mongoose.disconnect();
}