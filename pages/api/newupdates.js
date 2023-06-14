// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import FeatureUpdateModel from "../../mongoose/FeatureUpdateModel";
import { ConnectDB } from "../../mongoose/mongo-conn";

const handler = async (req, res) => {
	await ConnectDB();

	console.log("Connected in Handler");

	const featureUpdates = await FeatureUpdateModel.find().lean();

	console.log(featureUpdates);
	
	res.status(200).send(featureUpdates);

	console.log("res sent 200 allegedly");
}

export default handler;