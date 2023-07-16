// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import UserSongListModel, {userSongListSchema} from "../../mongoose/UserSongListModel";
import { ConnectDB } from "../../mongoose/mongo-conn";

const handler = async (req, res) => {
	if (req.method !== "POST")
	{
		res.status(405).json({message: "Only POST requests allowed"});
		return;
	}

	await ConnectDB();

	const { userId, username, song } = req.body;

	const userSongList = await UserSongListModel.findOne({ UserId: userId });

	let newSong = {
		id: 1,
		song: song
	};

	// List exists
	if (userSongList !== null && userSongList !== undefined)
	{
		if (userSongList.SongList.findIndex(s => s.song === song) >= 0)
		{
			res.status(400).json({message: "Song already exists in this list!"});
			return;
		}

		newSong.id = userSongList.SongList.length + 1;

		userSongList.SongList.push(newSong);
		userSongList.save();
	}
	else
	{
		const newSongList = new UserSongListModel({
			UserId: userId,
			UserName: username,
			SongList: [newSong]
		});
		newSongList.save();
	}

	res.status(200).json({message: "OK"});
}

export default handler;