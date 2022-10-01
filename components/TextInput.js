import {styled, TextField} from "@mui/material";

const TextInput = styled(TextField)(({ theme }) => `
	border-radius: ${theme.spacing(0.5)};

	.MuiInput-root {
		color: white;
		padding-left: ${theme.spacing(1)};
		background-color: #2f2f2f;
	}

	.MuiFormHelperText-root {
		color: white;
	}
`);

export default TextInput;