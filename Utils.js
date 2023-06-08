export const Settings = {
	PAGE_TITLE_HOME: "SerBot Site",  
	PAGE_TITLE_COMMANDS: "SerBot - Commands",  
	PAGE_TITLE_COUNTDOWNS: "SerBot - Countdowns",  
}

export const SNACKBAR_SEVERITY_WARNING = "warning";
export const SNACKBAR_SEVERITY_INFO = "info";
export const SNACKBAR_SEVERITY_SUCCESS = "success";
export const SNACKBAR_SEVERITY_ERROR = "error";

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