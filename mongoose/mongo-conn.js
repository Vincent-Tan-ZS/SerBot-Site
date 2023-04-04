import mongoose from "mongoose";

let dbConn = null;

export const ConnectDB = async() => {
    if (dbConn !== null) return;

    try
    {
        dbConn = await mongoose.connect(
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
    if (dbConn === null) return;
	await mongoose.disconnect();
}