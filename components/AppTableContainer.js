import {TableContainer, styled} from "@mui/material";

const AppTableContainer = styled(TableContainer)(({ theme }) => `
	.MuiTableCell-root, {
		color: white;
	}

	.MuiIconButton-root {
		color: white;
		margin-top: 0;

		&:hover {
			color: ${theme.palette.primary.main};
		}
	}

	.MuiTableHead-root {
		.MuiTableCell-root {
			background-color: black;
			font-weight: bolder;
		}
	}

	.MuiTableBody-root {
		.MuiTableRow-root {
			&:hover {
				background-color: #323232;

				.MuiTableCell-root {

					&, .MuiTypography-root {
						font-weight: bolder;
						color: ${theme.palette.primary.main};
					}
				}
			}
		}
	}
`);

export default AppTableContainer;