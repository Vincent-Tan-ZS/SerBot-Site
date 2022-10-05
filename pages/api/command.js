// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import CommandModel from "../../mongoose/CommandModel";
import { ConnectDB, DisconnectDB } from "../../mongoose/mongo-conn";

const handler = async (req, res) => {
	await ConnectDB();

	const commands = await CommandModel.find({});
	
	res.status(200).send(commands);

	await DisconnectDB();
}

export default handler;