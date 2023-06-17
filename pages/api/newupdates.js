// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import FeatureUpdateModel from "../../mongoose/FeatureUpdateModel";
import { ConnectDB } from "../../mongoose/mongo-conn";

const handler = async (req, res) => {
	await ConnectDB();

	const featureUpdates = await FeatureUpdateModel.find().lean();
	
	res.status(200).send(featureUpdates);
}

export default handler;