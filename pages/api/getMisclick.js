// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import MisclickCountModel from "../../mongoose/MisclickCountModel";
import { ConnectDB } from "../../mongoose/mongo-conn";

const handler = async (req, res) => {
	await ConnectDB();

	const misclickCounts = await MisclickCountModel.find().lean();
	
	res.status(200).send(misclickCounts);
}

export default handler;