import {Alert, Snackbar} from "@mui/material";

function MainSnackbar(props) {
	const { open, onClose, text, severity } = props;

	return (
		<Snackbar open={open} onClose={onClose}>
			<Alert onClose={onClose} severity={severity ?? "warning"}>
				{text}
			</Alert>
		</Snackbar>
	)
}

export default MainSnackbar;