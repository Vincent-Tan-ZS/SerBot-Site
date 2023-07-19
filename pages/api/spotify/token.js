// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios"

const handler = async (req, res) => {
	if (req.method !== "GET")
	{
		res.status(405).json({message: "Only GET requests allowed"});
		return;
	}

	let status = 200;
	let resp = {
		message: "OK"
	}

	try
	{
		const res = await axios.post("https://accounts.spotify.com/api/token", {
			"grant_type": "client_credentials"
		}, {
			headers: {
				Authorization: `Basic ${(new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))}`,
				"Content-Type": "application/x-www-form-urlencoded"
			}
		});
		
		resp.token = res.data["access_token"];
	}
	catch (err)
	{
		status = err.response.data.status;
		resp.message = err.response.data.message;
	}

	res.status(status).json(resp);
}

export default handler;