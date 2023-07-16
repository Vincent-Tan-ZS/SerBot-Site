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

	const body = JSON.parse(req.body);
	const { userId, username, userImage, song } = body;

	const userSongList = await UserSongListModel.findOne({ UserId: userId });

	// List exists
	if (userSongList !== null && userSongList !== undefined)
	{
		userSongList.SongList.push(song);
		userSongList.save();
	}
	else
	{
		const newSongList = new userSongListSchema({
			UserId: userId,
			UserName: username,
			UserImage: userImage,
			SongList: [song]
		});
		newSongList.save();
	}

	res.status(200).send({message: "OK"});
}

export default handler;