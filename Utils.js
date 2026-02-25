import {isAfter} from "date-fns";
import { ConnectDB } from "./mongoose/mongo-conn";
import AuthCodeModalChild from "./components/Modals/AuthCodeModalChild";

export const Settings = {
	PAGE_TITLE_HOME: "SerBot Site",  
	PAGE_TITLE_COMMANDS: "SerBot - Commands",  
	PAGE_TITLE_COUNTDOWNS: "SerBot - Countdowns",  
	PAGE_TITLE_RECIPES: "SerBot - Meal Recipes",  
}

export const SNACKBAR_SEVERITY_WARNING = "warning";
export const SNACKBAR_SEVERITY_INFO = "info";
export const SNACKBAR_SEVERITY_SUCCESS = "success";
export const SNACKBAR_SEVERITY_ERROR = "error";

export const HTTPMethod = {
	GET: "GET",
	POST: "POST"
}

export const SelectMenuProps = {
	MenuListProps: {
		sx: {
			background: '#121216',
			color: 'white',
			'.MuiMenuItem-root:hover': {
				background: '#19191e'
			}
		}
	}
};

export const DataCrudType = {
	Read: 1,
	Create: 2,
	Update: 3
}

export const CopyToClipboard = (snackbarStates, text) => {
	let _msg = "";
	let _severity = SNACKBAR_SEVERITY_WARNING;

	try
	{
		navigator.clipboard.writeText(text);
		_msg = "Copied to Clipboard";
		_severity = SNACKBAR_SEVERITY_INFO;
	}
	catch (e)
	{
		_msg = "Unable to Copy to Clipboard";
		_severity = SNACKBAR_SEVERITY_ERROR;
	}

	SetSnackbarText(snackbarStates, _msg);
	SetSnackbarSeverity(snackbarStates, _severity);
	SetSnackbarOpen(snackbarStates, true);
}

export const SetSnackbarText = (snackbarStates, value) => {
	snackbarStates.setSnackbarText(value);
}

export const SetSnackbarSeverity = (snackbarStates, value) => {
	snackbarStates.setSnackbarSeverity(value);
}

export const SetSnackbarOpen = (snackbarStates, value) => {
	snackbarStates.setSnackbarOpen(value);
}

export const SetErrorSnackbar = (snackbarStates, message) => {
	SetSnackbarOpen(snackbarStates, true);
	SetSnackbarSeverity(snackbarStates, SNACKBAR_SEVERITY_ERROR);
	SetSnackbarText(snackbarStates, message);
}

export const GetNumberOfPages = (list, rowNo, colNo) => {
	return colNo === undefined 
		? Math.ceil(list.length / rowNo)
		: 0;
}

export const ChunkArray = (list, chunkSize) => {
	if (list === undefined || list.length <= 0) return [];
	
	return list.reduce((prev, cur, index) => {
		const chunkIndex = Math.floor(index/chunkSize);

		if (!prev[chunkIndex]) {
			prev[chunkIndex] = []
		};

		prev[chunkIndex].push(cur);
		return prev;
	}, []);
}

export const CheckAuthCode = () => {
	const sessionExpiration = sessionStorage.getItem("DiscordUserExpiresOn");
    if (sessionExpiration !== undefined || sessionExpiration !== null)
    {
      if (isAfter(new Date(), new Date(sessionExpiration)))
      {
        sessionStorage.removeItem("DiscordUserId");
        sessionStorage.removeItem("DiscordUserName");
        sessionStorage.removeItem("DiscordUserExpiresOn");
      }
    }
}

export const GetYTEmbed = (link) => {
	const _url = new URL(link);
	const ytId = _url.searchParams.get("v");
	
	return `https://www.youtube.com/embed/${ytId}?autoplay=1`;
}

export const IsValidURL = (str) => {
	try
	{
		new URL(str);
		return true;
	}
	catch (e)
	{
		return false;
	}
}

export const ApiFetcher = (...args) => fetch(...args).then(res => res.json());

export const ExecuteAuthAction = (callback, modalStates, mutate) => {
	CheckAuthCode();
	
	const userId = sessionStorage.getItem("DiscordUserId");
	
	if (userId?.length > 0)
	{
		modalStates.CloseModal();
		if (callback) callback();
	}
	else
	{	
		modalStates.OpenModal({
			title: "User Confirmation",
			height: "auto",
			children: <AuthCodeModalChild refresh={mutate} callback={callback} />
		});
	}
}

export const Fetch = async (method, url, payload) => {
	try
	{
		const resp = await fetch(url, {
			method: method,
			body: JSON.stringify(payload)
		});

		const jsonData = await resp.json();
		if (!resp.ok) return Promise.reject({ response: { data: { message: jsonData.message } } });
		return { data: jsonData };
	}
	catch (e)
	{
		return Promise.reject({ response: { data: { message: e.message } } });
	}
}

export const AssertPost = async (req, res) => {
	if (req.method === HTTPMethod.POST) return true;
	return res.status(405).json({message: "Only POST requests allowed"});
}

export const ApiGetAll = async (mongoModel, res) => {
	await ConnectDB();

	const data = await mongoModel.find().lean();
	
	res.status(200).send(data);
}

export const ParseRequestPayload = (req) => JSON.parse(req.body);