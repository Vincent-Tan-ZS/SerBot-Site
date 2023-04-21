import {IconButton, Stack, Tooltip} from "@mui/material";
import {Link as LinkIcon, Delete as DeleteIcon, Edit as EditIcon, Delete} from '@mui/icons-material';
import {CopyToClipboard} from "../../Utils";
import React from "react";
import {SnackbarContext} from "../../contexts/SnackbarContext";

export default function MobileCardClickedModalChild(props) {
	const { name, link } = props;
	const snackbarStates = React.useContext(SnackbarContext);

	const OnDeleteClicked = () => {
		CopyToClipboard(snackbarStates, `ser cd delete ${name}`);
	}

	const OnEditClicked = () => {
		CopyToClipboard(snackbarStates, `ser cd update ${name}`);
	}

	const OnLinkClicked = () => {
		window.open(link, "_blank");
	}

	return (
		<Stack direction={"row"} gap={1} justifyContent={"center"}>
			<Tooltip title={"Copy update command"}>
				<IconButton color={"primary"} onClick={OnEditClicked}>
					<EditIcon fontSize={"large"} />
				</IconButton>
			</Tooltip>
			<Tooltip title={"Copy delete command"}>
				<IconButton color={"primary"} onClick={OnDeleteClicked}>
					<DeleteIcon fontSize={"large"} />
				</IconButton>
			</Tooltip>
			{
				link?.length > 0 &&
				<Tooltip title={"Visit Countdown URL"}>
					<IconButton color={"primary"} onClick={OnLinkClicked}>
						<LinkIcon fontSize={"large"} />
					</IconButton>
				</Tooltip>
			}
		</Stack>
	)
}