import {Box, Button, Grid, MenuItem, Select, Stack} from "@mui/material";
import TextInput from "../TextInput";
import React from "react";
import {CopyToClipboard, SelectMenuProps} from "../../Utils";
import {SnackbarContext} from "../../contexts/SnackbarContext";

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
	const { command, inputs, selectOptions } = props;
	const snackbarStates = React.useContext(SnackbarContext);

	const [newCommand, setNewCommand] = React.useState(command);
	const [valueMappings, setValueMappings] = React.useState({});
	
	React.useEffect(() => {
		let newCommandText = command;
		Object.entries(valueMappings).forEach(([k, v]) => {
			newCommandText = newCommandText.replace(k, v);
		});

		setNewCommand(newCommandText);
	}, [valueMappings]);

	const CopyCommand = () => {
		CopyToClipboard(snackbarStates, newCommand);
	}

	const OnTextChange = (input, prefix) => (e) => {
		const { value } = e.target;
		let newInputText = value.length <= 0 ? input : value;

		if (prefix)
		{
			if (!newInputText.startsWith(prefix))
			{
				newInputText = prefix + newInputText;
			}
		}

		const newValueMappings = {
			...valueMappings,
			[input]: newInputText
		};

		setValueMappings(newValueMappings);
	}

	const OnSelectChange = (input) => (e) => {
		const { value } = e.target;
		const newInputText = value.length <= 0 ? input : value;

		const newValueMappings = {
			...valueMappings,
			[input]: newInputText
		};

		setValueMappings(newValueMappings);
	}

	return (
		<Stack gap={2}>
			<Grid container spacing={2}>
				{
					inputs.map((i) => 
						<Grid key={`input-${i}`} item xs>
							{
								// Text Input {}
								i.startsWith('{') &&
								<TextInput label={i} variant={"outlined"} onChange={OnTextChange(i)} fullWidth />
							}
							{
								// Mentions @
								i.startsWith('@') &&
								<TextInput label={i} variant={"outlined"} onChange={OnTextChange(i, '@')} fullWidth />
							}
							{
								// Options []
								i.startsWith('[') &&
								<Select fullWidth MenuProps={SelectMenuProps} onChange={OnSelectChange(i)}>
									{
										selectOptions[i].map((option) => {
											return (
												<MenuItem key={`select-${option}`} value={option}>{option}</MenuItem>
											)
										})
									}
								</Select>
							}
						</Grid>
					)
				}
			</Grid>
			<Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: 'large'}}>
				<span>
					{newCommand}
				</span>
				<Button variant={"contained"} onClick={CopyCommand}>Copy To Clipboard</Button>
			</Box>
		</Stack>
	)
}