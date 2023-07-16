// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import UserSongListModel from "../../mongoose/UserSongListModel";
import { ConnectDB } from "../../mongoose/mongo-conn";

const handler = async (req, res) => {
	await ConnectDB();

	const songLists = await UserSongListModel.find().lean();
	
	res.status(200).send(songLists);
}

export default handler;