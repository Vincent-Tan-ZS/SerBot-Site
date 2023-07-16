// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import UserSongListModel, {userSongListSchema} from "../../mongoose/UserSongListModel";
import { ConnectDB } from "../../mongoose/mongo-conn";

const handler = async (req, res) => {
	if (req.method !== "POST")
	{
		res.status(405).send({message: "Only POST requests allowed"});
		return;
	}

	await ConnectDB();

	const { userId, songId } = req.body;

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