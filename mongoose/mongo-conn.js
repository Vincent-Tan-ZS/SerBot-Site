import mongoose from "mongoose";

let dbConn = null;

export const ConnectDB = async() => {
    if (dbConn !== null) return;

    try
    {
        dbConn = await mongoose.connect(
            `mongodb+srv://${process.env.NEXT_PUBLIC_MONGO_USER}:${process.env.NEXT_PUBLIC_MONGO_PASSWORD}@${process.env.NEXT_PUBLIC_MONGO_CLUSTER}/?retryWrites=true&w=majority`, {
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