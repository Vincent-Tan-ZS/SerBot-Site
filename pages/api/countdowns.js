// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import CountdownModel from "../../mongoose/CountdownModel";
import { ApiGetAll } from "../../Utils";

const handler = async (req, res) => ApiGetAll(CountdownModel, res);

export default handler;