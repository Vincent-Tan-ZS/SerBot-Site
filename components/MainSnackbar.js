import styled from "@emotion/styled";
import {Alert, Snackbar} from "@mui/material";
import {SNACKBAR_SEVERITY_INFO} from "../Utils";

const MainAlert = styled(Alert)`
	.MuiAlert-message {
		align-self: center;
	}
`;

function MainSnackbar(props) {
	const { open, onClose, text, severity } = props;

	return (
		<Snackbar open={open} onClose={onClose}>
			<MainAlert onClose={onClose} severity={severity ?? SNACKBAR_SEVERITY_INFO}>
				{text}
			</MainAlert>
		</Snackbar>
	)
}

export default MainSnackbar;