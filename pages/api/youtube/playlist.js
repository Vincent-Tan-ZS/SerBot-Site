// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Client } from 'youtubei';
import UserSongListModel from "../../../mongoose/UserSongListModel";

const handler = async (req, res) => {
	if (req.method !== "POST")
	{
		res.status(405).json({message: "Only POST requests allowed"});
		return;
	}

	const { playlistId, userId, username } = req.body;

	let status = 200;
	let resp = {
		message: "OK"
	}

	try
	{
		if (userId === undefined || userId === null)
		{
			throw "Authorization Expired, please get a new authorization code and try again";
		}

		if (playlistId === undefined || playlistId === null || playlistId?.length <= 0)
		{
			throw "No Playlist ID provided";
		}

		const ytAPI = new Client();

		const res = await ytAPI.getPlaylist(playlistId);
		
		if (res.videoCount <= 0) 
		{
			throw "No videos in the playlist or unreachable playlist";
		}

		const ytURLs = res.videos.items.map((i) => `https://www.youtube.com/watch?v=${i.id}`);

		const userSongList = await UserSongListModel.findOne({ UserId: userId });

		// List Exists
		if (userSongList !== null && userSongList !== undefined)
		{
			let updatedList = [...userSongList.SongList];
			let newId = updatedList.length + 1;

			ytURLs.forEach((t) => {
				if (userSongList.SongList.findIndex((s) => s.song === t) < 0)
				{
					userSongList.SongList.push({
						id: newId,
						song: t
					});

					newId++;
				}
			});
			
			userSongList.save();
		}
		else
		{
			const newTracks = ytURLs.map((t, i) => {
				return {
					id: i + 1,
					song: t
				};
			});

			const newSongList = new UserSongListModel({
				UserId: userId,
				UserName: username,
				SongList: newTracks
			});
			newSongList.save();
		}
	}
	catch (err)
	{
		status = 400;
		resp.message = err;
	}

	res.status(status).json(resp);
}

export default handler;