// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import MisclickCountModel from "../../mongoose/MisclickCountModel";
import { ApiGetAll } from "../../Utils";

const handler = async (req, res) => ApiGetAll(MisclickCountModel, res);

export default handler;