// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import ChefMealModel from "../../mongoose/ChefMealModel";
import { ConnectDB } from "../../mongoose/mongo-conn";

const handler = async (req, res) => {
	await ConnectDB();

	const recipes = await ChefMealModel.find().lean();
	
	res.status(200).send(recipes);
}

export default handler;