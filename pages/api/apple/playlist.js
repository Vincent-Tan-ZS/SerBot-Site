// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import UserSongListModel from "../../../mongoose/UserSongListModel";
import { HTTPMethod, AssertPost, ParseRequestPayload } from "../../../Utils";

const handler = async (req, res) => {
	if (!AssertPost(req, res)) return;

	const { playlistUrl, userId, username } = ParseRequestPayload(req);

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

		if (playlistUrl === undefined || playlistUrl === null || playlistUrl?.length <= 0)
		{
			throw "No Playlist URL provided";
		}

		let tracks = [];

		const res = await Fetch(HTTPMethod.GET, playlistUrl);

		let doc = new jsdom.JSDOM(res.data);
		let rows = doc.window.document.getElementsByClassName("songs-list-row");
	
		for (let i = 0; i < rows.length; ++i)
		{
			const row = rows.item(i);
	
			const title = row.getElementsByClassName("songs-list-row__song-name")[0].textContent;
			const artists = row.getElementsByClassName("songs-list__col--secondary");
	
			let artistStrs = [];
			for (let i = 0; i < artists.length; ++i)
			{
				let artist = artists.item(i);
				let artistAnchors = artist.getElementsByClassName("click-action");
	
				for (let j = 0; j < artistAnchors.length; ++j)
				{
					artistStrs.push(artistAnchors[j].textContent);
				}
			}

			tracks.push(`${artistStrs.join(", ")} - ${title}`);
		}

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
		status = 400;
		resp.message = err;
	}

	res.status(status).json(resp);
}

export default handler;