import {Button, Stack, TextField} from "@mui/material";
import React from "react";
import {SnackbarContext} from "../../contexts/SnackbarContext";
import {Fetch, HTTPMethod, SNACKBAR_SEVERITY_ERROR, SetSnackbarOpen, SetSnackbarSeverity, SetSnackbarText} from "../../Utils";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";

export default function AuthCodeModalChild(props) {
	const { refresh } = props;

	const [authCode, setAuthCode] = React.useState("");
	const inputRef = React.useRef(null);
	const snackbarStates = React.useContext(SnackbarContext);
	const { setAuthed } = React.useContext(AuthenticationContext);

	React.useEffect(() => {
		inputRef.current.focus();
	}, []);

	const OnAuthCodeChanged = (e) => {
		setAuthCode(e.target.value);
	}

	const OnAuthCodeClicked = () => {
		Fetch(HTTPMethod.POST, './api/authorize', {
			code: authCode
		}).then((resp) => {
			sessionStorage.setItem("DiscordUserId", resp.data.userId);
			sessionStorage.setItem("DiscordUserName", resp.data.userName);
			sessionStorage.setItem("DiscordUserExpiresOn", resp.data.expiration);

			refresh();
			setAuthed(true);
		}).catch((err) => {
			SetSnackbarOpen(snackbarStates, true);
			SetSnackbarSeverity(snackbarStates, SNACKBAR_SEVERITY_ERROR);
			SetSnackbarText(snackbarStates, err.response.data.message);
		});
	}
	
	return (
		<>
			<Stack spacing={2}>
				<TextField inputRef={inputRef} size="small" label={"Authorization Code"} value={authCode} onChange={OnAuthCodeChanged} placeholder={"Retrieve and enter the Authorization Code from SerBot (ser auth)"}/>
				<Button variant={"contained"} disabled={authCode.length <= 0} onClick={OnAuthCodeClicked}>Continue</Button>
			</Stack>
		</>
	)
}