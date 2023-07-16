// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {add, isAfter} from "date-fns";
import SiteAuthorizationModel from "../../mongoose/SiteAuthorizationModel";
import UserSongListModel, {userSongListSchema} from "../../mongoose/UserSongListModel";
import { ConnectDB } from "../../mongoose/mongo-conn";

const handler = async (req, res) => {
	if (req.method !== "POST")
	{
		res.status(405).json({message: "Only POST requests allowed"});
		return;
	}

	await ConnectDB();

	const { code } = req.body;

	const siteAuth = await SiteAuthorizationModel.findOne({ AuthCode: code });

	if (siteAuth === null || siteAuth === undefined)
	{
		res.status(400).json({message: "Invalid authorization code"});
	}

	if (isAfter(new Date, siteAuth.ExpiresOn) === true)
	{
		res.status(400).json({message: "Authorization code expired"});
	}

	res.status(200).json({message: "OK", userId: siteAuth.UserId, userName: siteAuth.UserName, expiration: siteAuth.ExpiresOn});
}

export default handler;