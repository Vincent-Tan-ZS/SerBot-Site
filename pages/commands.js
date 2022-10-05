import {Box, IconButton, Pagination, Stack, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import { ContentCopy as CopyIcon } from '@mui/icons-material';
import React from "react";
import TextInput from "../components/TextInput";
import MainSnackbar from "../components/MainSnackbar";
import AppBody from "../components/AppBody";

const CommandsTableContainer = styled(TableContainer)(({ theme }) => `
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
						font-size: 12px;
						color: ${theme.palette.primary.main};
					}
				}
			}
		}
	}
`);

const HeaderBox = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: center;

	width: 100%;
`;

const CommandsInput = styled(TextInput)`
	width: 80%;

	.MuiInput-input {
		height: 4rem;
		font-size: 24px;
	}
`;

const CommandsPagination = styled(Pagination)`
	.MuiPaginationItem-root {
		color: white;
	}
`;

const noOfRows = 10;

function Commands(props) {
	const { list } = props;

	// List States
	const [commandList, setCommandList] = React.useState([]);

	// Filter States
	const [filterText, setFilterText] = React.useState("");

	// Pagination States
	const [curPage, setCurPage] = React.useState(1);
	const [numberOfPages, setNumberOfPages] = React.useState(1);
	const [pageList, setPageList] = React.useState([]);

	// Alert States
	const [alertOpen, setOpenAlert] = React.useState(false);
	const [severity, setSeverity] = React.useState("warning");
	const [alertMessage, setAlertMessage] = React.useState("");

	React.useEffect(() => {
		let _list = list.map(li => {
			let _usage = li.Usage.map(u => `ser ${li.List[0]} ${u}`.trim());

			return {
				Title: li.Title,
				List: li.List,
				Description: li.Description,
				Usage: _usage
			}
		});

		let _numberOfPages = GetNumberOfPages(_list);

		setCommandList(_list);
		setNumberOfPages(_numberOfPages);
	}, [list]);

	React.useEffect(() => {
		if (commandList.length <= 0) return;

		let _pageList = GetPageList(commandList);
		setPageList(_pageList);
	}, [commandList, curPage]);

	React.useEffect(() => {
		if (commandList.length <= 0) return;

		let _filtered = commandList.filter(c => c.Title.toLowerCase().includes(filterText.toLowerCase()) || 
												c.List.find(l => l.toLowerCase().includes(filterText.toLowerCase())) !== undefined);

		let _pageList = GetPageList(_filtered, 1);
		let _numberOfPages = GetNumberOfPages(_filtered);

		setCurPage(1);
		setNumberOfPages(_numberOfPages);
		setPageList(_pageList);
	}, [filterText]);

	const GetPageList = (_list, _page = curPage) => {
		return _list.slice((_page - 1) * noOfRows, _page * noOfRows);
	}

	const GetNumberOfPages = (_list) => {
		return Math.ceil(_list.length / noOfRows);
	}

	const OnPageChange = (e, _page) => {
		setCurPage(_page);
	}

	const OnInputChanged = (e) => {
		setFilterText(e.target.value);
	}

	const OnAlertClosed = () => {
		setOpenAlert(false);
	}

	const OnCopyClicked = (list) => () => {
		let _msg = "";
		let _severity = "warning";

		try
		{
			navigator.clipboard.writeText(list);
			_msg = "Copied to Clipboard";
			_severity = "info";
		}
		catch (e)
		{
			_msg = "Unable to Copy to Clipboard";
			_severity = "error";
		}

		setAlertMessage(_msg);
		setSeverity(_severity);
		setOpenAlert(true);
	}

	return (
		<>
			<AppBody>
				<Stack spacing={1} flexDirection={"column"} height={"100%"} justifyContent={"space-between"}>
					<Stack spacing={2}>
						<HeaderBox>
							<CommandsInput variant="standard" value={filterText} onChange={OnInputChanged} helperText={"Search for a specific Command via Title or Description"} />
						</HeaderBox>
						<CommandsTableContainer>
							<Table stickyHeader>
								<colgroup>
									<col width={"20%"} />
									<col width={"10%"} />
									<col width={"50%"} />
									<col width={"20%"} />
								</colgroup>
								<TableHead>
									<TableRow>
										<TableCell>Title</TableCell>
										<TableCell>Commands</TableCell>
										<TableCell>Description</TableCell>
										<TableCell>Usage</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{
										pageList.length > 0 &&
										pageList.map(li => {
											return (
												<TableRow key={`command-${li.Title}`}>
													<TableCell size="small">{li.Title}</TableCell>
													<TableCell size="small">{li.List.join(", ")}</TableCell>
													<TableCell size="small">{li.Description}</TableCell>
													<TableCell size="small">
														{
															li.Usage.map((l) => {
																return (
																	<Stack key={`command-${li.Title}-usage-${l}`} spacing={1} flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"}>
																		<Typography>{l}</Typography>
																		<IconButton onClick={OnCopyClicked(l)} size={"small"}>
																			<CopyIcon />
																		</IconButton>
																	</Stack>
																)
															})
														}
													</TableCell>
												</TableRow>
											)
										})
									}
								</TableBody>
							</Table>
						</CommandsTableContainer>
					</Stack>
					<CommandsPagination page={curPage} onChange={OnPageChange} count={numberOfPages} color={"primary"} />
				</Stack>
			</AppBody>
			<MainSnackbar open={alertOpen} onClose={OnAlertClosed} severity={severity} text={alertMessage} />
		</>
	)
}

export const getStaticProps = async () => {
	let data = [];

	try
	{
		const resp = await fetch(`http://${process.env.DOMAIN_NAME}:${process.env.DOMAIN_PORT}/api/command`);
		const respData = await resp.json();

		data = respData.data;
	}
	catch (e)
	{
		console.log(e.message);
	}
	finally
	{
		return {
			props: {
				list: data
			}
		};
	}
}

export default Commands;