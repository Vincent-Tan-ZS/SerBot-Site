// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as spotifyAPI from 'spotify-web-api-node';
import UserSongListModel from "../../../mongoose/UserSongListModel";

const handler = async (req, res) => {
	if (req.method !== "POST")
	{
		res.status(405).json({message: "Only POST requests allowed"});
		return;
	}

	const { playlistId, accessToken, userId, username } = req.body;

	let status = 200;
	let resp = {
		message: "OK"
	}

	try
	{
		if (userId === undefined || userId === null)
		{
			throw {
				body: {
					error: {
						status: 400,
						message: "Authorization Expired, please get a new authorization code and try again"
					}
				}
			}
		} 

		const API = new spotifyAPI({
			clientId: process.env.SPOTIFY_CLIENT_ID,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
			redirectUri: 'http://localhost:3000'
		});
		API.setAccessToken(accessToken);

		let tracks = [];
		let remainingPromises = [];
		
		const res = await API.getPlaylistTracks(playlistId, {
			fields: "total,items(track(name,artists(name)))"
		});
		
		tracks = tracks.concat(res.body.items);

		// Get Remaining Tracks
		let remainingAmount = res.body.total - tracks.length;
		let offset = tracks.length;

		while (remainingAmount > 0)
		{
			remainingPromises.push(API.getPlaylistTracks(playlistId, {
				fields: "total,items(track(name,artists(name)))",
				offset: offset
			}));
			
			remainingAmount -= 100;
			offset += 100;
		}

		const remainingResp = await Promise.all(remainingPromises);
		remainingResp.forEach((resp) => {
			tracks = tracks.concat(resp.body.items);
		});

		tracks = tracks.map((t) => {
			let artists = t.track.artists.map((a) => a.name).join(", ");
			return `${artists} - ${t.track.name}`;
		});

		const userSongList = await UserSongListModel.findOne({ UserId: userId });

		// List Exists
		if (userSongList !== null && userSongList !== undefined)
		{
			let updatedList = [...userSongList.SongList];
			let newId = updatedList.length + 1;

			tracks.forEach((t) => {
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
			const newTracks = tracks.map((t, i) => {
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
		status = Number(err.body.error.status);
		resp.message = err.body.error.message;
	}

	res.status(status).json(resp);
}

export default handler;