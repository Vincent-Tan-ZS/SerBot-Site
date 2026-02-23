// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { AssertPost, ParseRequestPayload } from "../../Utils";
import UserSongListModel from "../../mongoose/UserSongListModel";
import { ConnectDB } from "../../mongoose/mongo-conn";

const handler = async (req, res) => {
	if (!AssertPost(req, res)) return;

	await ConnectDB();

	const { userId, songId } = ParseRequestPayload(req);

	const userSongList = await UserSongListModel.findOne({ UserId: userId });

	if (userSongList === null || userSongList === undefined)
	{
		res.status(400).send({message: "List doesn't exist, please add it"});
	}

	let index = userSongList.SongList.findIndex(s => s.id === songId);

	if (index >= 0)
	{
		let songList = [...userSongList.SongList];
		songList.splice(index, 1);

		userSongList.SongList = [...songList];
		userSongList.save();
	}

	res.status(200).send({message: "OK"});
}

export default handler;