import {Dialog, DialogActions, DialogContent, DialogTitle, styled} from "@mui/material";

const StyledDialog = styled(Dialog)(({ theme }) => `
	.MuiPaper-root {
		border-radius: 8px;
		background: transparent;
	}

	.MuiDialogTitle-root {
		background: #303436;
		color: white;
		font-weight: bold;
		font-size: 2rem;
	}

	.MuiDialogActions-root {
		background: #303436;
	}

	.MuiDialogContent-root {
		background: #24252C;
		padding-top: 32px !important;

		.MuiFormLabel-root {
			color: ${theme.palette.primary.main};
			font-weight: bold;
		}

		.MuiInputBase-root {
			.MuiInputBase-input, .MuiSelect-icon {
				color: white;
			}

			:not(&.Mui-error) {
				.MuiOutlinedInput-notchedOutline {
					border-color: ${theme.palette.primary.light};
				}
			}

			.MuiInputAdornment-root > button {
				color: white;
			}
		}
	}
`);

export default function BaseModal(props) {
	const { open, OnClose, title, maxWidth, height, children, actions } = props;

	return (
		<StyledDialog open={Boolean(open)} onClose={OnClose} maxWidth={maxWidth ?? "lg"} fullWidth>
			{
				title?.length > 0 &&
				<DialogTitle>
					{title}
				</DialogTitle>
			}
			<DialogContent sx={{height: height}}>
				{children}
			</DialogContent>
			{
				actions &&
				<DialogActions>
					{actions}
				</DialogActions>
			}
		</StyledDialog>
	)
}