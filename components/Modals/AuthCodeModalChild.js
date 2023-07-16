import {Button, Stack, TextField, Typography} from "@mui/material";
import React from "react";

export default function AuthCodeModalChild(props) {
	const [authCode, setAuthCode] = React.useState("");

	const OnAuthCodeChanged = (e) => {
		setAuthCode(e.target.value);
	}
	
	return (
		<>
			<Stack spacing={2}>
				<Typography variant="h5" color={"white"}>Please enter the Authentication Code given by SerBot</Typography>
				<TextField size="small" label={"Authentication Code"} value={authCode} onChange={OnAuthCodeChanged}/>
				<Button variant={"contained"} disabled={authCode.length <= 0}>Continue</Button>
			</Stack>
		</>
	)
}