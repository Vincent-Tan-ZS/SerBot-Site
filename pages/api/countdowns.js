// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import CountdownModel from "../../mongoose/CountdownModel";
import { ConnectDB } from "../../mongoose/mongo-conn";

const handler = async (req, res) => {
	await ConnectDB();

	const countdowns = await CountdownModel.find().lean();
	
	res.status(200).send(countdowns);
}

export default handler;