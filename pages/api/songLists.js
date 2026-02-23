// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ApiGetAll } from "../../Utils";
import UserSongListModel from "../../mongoose/UserSongListModel";

const handler = async (req, res) => ApiGetAll(UserSongListModel, res);

export default handler;