// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import ChefMealModel from "../../mongoose/ChefMealModel";
import { ConnectDB } from "../../mongoose/mongo-conn";
import { AssertPost, ParseRequestPayload } from "../../Utils";

const handler = async (req, res) => {
	if (!AssertPost(req, res)) return;

	await ConnectDB();

	const { id, name, ingredients, steps, username } = ParseRequestPayload(req);

	const recipe = await ChefMealModel.findOne({ Id: id });

	// Recipe exists
	if (recipe !== null && recipe !== undefined)
	{
        if (recipe.AddedBy !== username)
        {
            res.status(400).json({message: "Cannot update someone else's recipe."});
        }
        else 
        {
			recipe.Name = name;
			recipe.Ingredients = ingredients;
			recipe.Steps = steps;
			recipe.save();
        }
	}

	res.status(200).json({message: "OK"});
}

export default handler;