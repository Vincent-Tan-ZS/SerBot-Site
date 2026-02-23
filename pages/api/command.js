// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import CommandModel from "../../mongoose/CommandModel";
import { ApiGetAll } from "../../Utils";

const handler = async (req, res) => ApiGetAll(CommandModel, res);

export default handler;