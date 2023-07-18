// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import UserSongListModel from "../../mongoose/UserSongListModel";
import { ConnectDB } from "../../mongoose/mongo-conn";

const handler = async (req, res) => {
	if (req.method !== "POST")
	{
		res.status(405).json({message: "Only POST requests allowed"});
		return;
	}

	await ConnectDB();

	const { userId, songId, newSong } = req.body;

	const userSongList = await UserSongListModel.findOne({ UserId: userId });

	if (userSongList === null || userSongList === undefined)
	{
		res.status(400).json({message: "Song List doesn't exist!"});
		return;
	}

	const songIndex = userSongList.SongList.findIndex((s) => Number(s.id) === Number(songId));

	if (songIndex < 0)
	{
		res.status(400).json({message: "Song doesn't exist!"});
		return;
	}

	const newList = [...userSongList.SongList];
	newList[songIndex].song = newSong;

	userSongList.SongList = [...newList];
	userSongList.save();

	res.status(200).json({message: "OK"});
}

export default handler;