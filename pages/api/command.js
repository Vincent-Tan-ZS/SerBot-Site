// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import CommandModel from "../../mongoose/CommandModel";
import { ConnectDB } from "../../mongoose/mongo-conn";

const handler = async (req, res) => {
	await ConnectDB();

	const commands = await CommandModel.find().lean();
	
	res.status(200).send(commands);
}

export default handler;