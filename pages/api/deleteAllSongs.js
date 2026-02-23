// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { AssertPost, ParseRequestPayload } from "../../Utils";
import UserSongListModel from "../../mongoose/UserSongListModel";
import { ConnectDB } from "../../mongoose/mongo-conn";

const handler = async (req, res) => {
	if (!AssertPost(req, res)) return;

	await ConnectDB();

	const { userId } = ParseRequestPayload(req);

	const userSongList = await UserSongListModel.findOne({ UserId: userId });

	if (userSongList !== null && userSongList !== undefined)
	{
		userSongList.SongList = [];
		userSongList.save();
	}
	
	res.status(200).send({message: "OK"});
}

export default handler;