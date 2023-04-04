import styled from "@emotion/styled";
import {Alert, Snackbar} from "@mui/material";

const MainAlert = styled(Alert)`
	.MuiAlert-message {
		align-self: center;
	}
`;

function MainSnackbar(props) {
	const { open, onClose, text, severity } = props;

	return (
		<Snackbar open={open} onClose={onClose}>
			<MainAlert onClose={onClose} severity={severity ?? "warning"}>
				{text}
			</MainAlert>
		</Snackbar>
	)
}

export default MainSnackbar;