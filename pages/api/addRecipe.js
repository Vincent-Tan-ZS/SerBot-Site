// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import ChefMealModel from "../../mongoose/ChefMealModel";
import { ConnectDB } from "../../mongoose/mongo-conn";

const handler = async (req, res) => {
	if (req.method !== "POST")
	{
		res.status(405).json({message: "Only POST requests allowed"});
		return;
	}

	await ConnectDB();

	const { name, ingredients, steps, username } = req.body;

	const recipe = await ChefMealModel.findOne({ Name: name });

	// Recipe exists
	if (recipe !== null && recipe !== undefined)
	{
        res.status(400).json({message: "Recipe already exists!"});
        return;
	}

    const allIds = await ChefMealModel.find({}, "Id");
    const maxId = allIds.length > 0
		? Math.max(allIds.map(x => Number(x.Id)))
		: 1;

    const newRecipe = new ChefMealModel({
        Id: maxId + 1,
        Name: name,
        Ingredients: ingredients,
        Steps: steps,
        AddedBy: username
    });
    newRecipe.save();

	res.status(200).json({message: "OK"});
}

export default handler;