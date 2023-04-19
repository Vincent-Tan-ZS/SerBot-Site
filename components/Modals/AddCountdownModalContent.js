import {Box, Button, Stack, TextField} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {addDays, format, isBefore} from "date-fns";
import React from "react";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CountdownModel from "../../mongoose/CountdownModel";

export default function AddCountdownModalContent(props) {
	const { name } = props;

	const [userId, setUserId] = React.useState("");
	const [countdownName, setCountdownName] = React.useState(name ?? "");
	const [countdownDate, setCountdownDate] = React.useState(addDays(new Date(), 1));
	const [countdownDescription, setCountdownDescription] = React.useState("");
	const [countdownImage, setCountdownImage] = React.useState("");
	const [countdownURL, setCountdownURL] = React.useState("");

	const OnUserIdChanged = (e) => {
		setUserId(e.target.value);
	}

	const OnCountdownNameChanged = (e) => {
		setCountdownName(e.target.value);
	}

	const OnCountdownDateChanged = (val) => {
		setCountdownDate(val);
	}

	const OnCountdownDescriptionChanged = (e) => {
		setCountdownDescription(e.target.value);
	}

	const OnCountdownImageChanged = (e) => {
		setCountdownImage(e.target.value);
	}

	const OnCountdownURLChanged = (e) => {
		setCountdownURL(e.target.value);
	}

	const OnSubmitClicked = () => {
		if (countdownName.length <= 0) return;
		if (isBefore(countdownDate, new Date()) === true) return;

		const newCountdown = new CountdownModel({
			Name: countdownName,
			Date: format(countdownDate, "MM/dd/yyyy"),
			Description: countdownDescription,
			Image: countdownImage,
			URL: countdownURL,
			UserId: userId
		});

		// newCountdown.save();
	}

	return (
		<>
			<Stack gap={2}>
				<TextField label={"Discord User ID"} variant={"outlined"} value={userId} onChange={OnUserIdChanged} fullWidth required error={userId.length <= 0} />	
				<TextField label={"Countdown Name"} variant={"outlined"} value={countdownName} onChange={OnCountdownNameChanged} fullWidth required error={countdownName.length <= 0} />	
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker label={"Countdown Date"} variant={"outlined"} value={countdownDate} onChange={OnCountdownDateChanged} fullWidth required format={"dd/MM/yyyy"} minDate={addDays(new Date(), 1)} />
				</LocalizationProvider>
				<TextField label={"Countdown Description"} variant={"outlined"} value={countdownDescription} onChange={OnCountdownDescriptionChanged} fullWidth />
				<TextField label={"Countdown Image"} variant={"outlined"} value={countdownImage} onChange={OnCountdownImageChanged} fullWidth />
				<TextField label={"Countdown URL"} variant={"outlined"} value={countdownURL} onChange={OnCountdownURLChanged} fullWidth />
			</Stack>
			<Box pt={2} display={'flex'} flexDirection={"row-reverse"} width={'100%'}>
				<Button onClick={OnSubmitClicked} size={"large"} variant={"contained"}>Submit</Button>
			</Box>
		</>
	)
}