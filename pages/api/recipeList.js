// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import ChefMealModel from "../../mongoose/ChefMealModel";
import { ApiGetAll } from "../../Utils";

const handler = async (req, res) => ApiGetAll(ChefMealModel, res);

export default handler;