import {Box, Button, Grid, MenuItem, Select, Stack} from "@mui/material";
import TextInput from "../TextInput";
import React from "react";
import {CopyToClipboard, SelectMenuProps} from "../../Utils";
import {SnackbarContext} from "../../contexts/SnackbarContext";

const DayValues = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const InputGrid = (props) => {
	const { list, OnChange, selectValues } = props;

	return (
		<>
			{
				list.length > 0 &&
				<Grid container spacing={2}>
				{
					list.map((l) => {
						return (
							<Grid key={`input-${l}`} item xs>
								{
									selectValues !== undefined && selectValues.length > 0 &&
									<Select fullWidth MenuProps={SelectMenuProps} onChange={OnChange(l)}>
										{
											selectValues.map((v) => {
												return (
													<MenuItem key={`select-${v}`} value={v}>{v}</MenuItem>
												)
											})
										}
									</Select>
								}
								{
									(selectValues === undefined || selectValues?.length <= 0) &&
									<TextInput label={l} variant={"outlined"} onChange={OnChange(l)} fullWidth />
								}
							</Grid>
						)
					})
				}
				</Grid>
			}
		</>
	)
}

const UpdateValues = (val, setVal, key, value) => {
	let _values = [...val];
	let keyVal = _values.find(v => Object.keys(v)[0] === key);

	if (keyVal !== undefined)
	{
		keyVal[key] = value;
	}
	else
	{
		let obj = {};
		obj[key] = value;
		_values.push(obj);
	}

	setVal(_values);
}

const FillCommand = (cmd, values) => {
	values.forEach((v) => {
		const [key, val] = Object.entries(v)[0];
		cmd = cmd.replace(key, val);
	});

	return cmd;
}

export function CopyCommandsModalChild(props) {
	const { command, mentions, days, options } = props;
	const snackbarStates = React.useContext(SnackbarContext);

	const [newCommand, setNewCommand] = React.useState(command);
	const [mentionValues, setMentionValues] = React.useState([]);
	const [dayValues, setDayValues] = React.useState([]);
	const [optionValues, setOptionValues] = React.useState([]);

	const OnMentionsChanged = (mention) => (e) => {
		let { value } = e.target;

		value = value?.length <= 0
			? mention
			: `@${value}`;

		UpdateValues(mentionValues, setMentionValues, mention, value);
	}

	const OnDaysChanged = (day) => (e) => {
		let { value } = e.target;

		if (value?.length <= 0)
		{
			value = day;
		}

		UpdateValues(dayValues, setDayValues, day, value);
	}

	const OnOptionsChanged = (option) => (e) => {
		let { value } = e.target;

		if (value?.length <= 0)
		{
			value = option;
		}

		UpdateValues(optionValues, setOptionValues, option, value);
	}

	React.useEffect(() => {
		let _command = FillCommand(command, mentionValues);
		_command = FillCommand(_command, dayValues);
		_command = FillCommand(_command, optionValues);

		setNewCommand(_command);
	}, [mentionValues, dayValues, optionValues]);

	const CopyCommand = () => {
		CopyToClipboard(snackbarStates, newCommand);
	}
	
	return (
		<>
			<Stack gap={2}>
				<InputGrid list={mentions} OnChange={OnMentionsChanged} />
				<InputGrid list={days} OnChange={OnDaysChanged} selectValues={DayValues} />
				<InputGrid list={options} OnChange={OnOptionsChanged} />
				<Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: 'large'}}>
					<span>
						{newCommand}
					</span>
					<Button variant={"contained"} onClick={CopyCommand}>Copy To Clipboard</Button>
				</Box>
			</Stack>
		</>
	)
}