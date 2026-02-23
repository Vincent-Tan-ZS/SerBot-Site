// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import FeatureUpdateModel from "../../mongoose/FeatureUpdateModel";
import { ApiGetAll } from "../../Utils";

const handler = async (req, res) => ApiGetAll(FeatureUpdateModel, res);

export default handler;