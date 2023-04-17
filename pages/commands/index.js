import {CircularProgress, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";
import { ContentCopy as CopyIcon } from '@mui/icons-material';
import React from "react";
import MainSnackbar from "../../components/MainSnackbar";
import AppBody from "../../components/AppBody";
import useSWRImmutable from "swr/immutable"; 
import {GetNumberOfPages} from "../../Utils";
import SearchInput from "../../components/SearchInput";
import AppPagination from "../../components/AppPagination";
import AppTableContainer from "../../components/AppTableContainer";
import HeaderBox from "../../components/HeaderBox";

const noOfRows = 10;
const helperText = "Search for a specific Command via Title or Description";
const fetcher = (...args) => fetch(...args).then(res => res.json());

function Commands() {
	// List States
	const { data, isValidating } = useSWRImmutable("/api/command", fetcher)
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
		let _list = [];
		let _numberOfPages = 0;

		if (data !== undefined)
		{
			_list = data.map(li => {
				let _usage = li.Usage.map(u => `ser ${li.List[0]} ${u}`.trim());
	
				return {
					Title: li.Title,
					List: li.List,
					Description: li.Description,
					Usage: _usage
				}
			});
	
			_numberOfPages = GetNumberOfPages(_list, noOfRows);
		}

		setCommandList(_list);
		setNumberOfPages(_numberOfPages);
	}, [data]);

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
		let _numberOfPages = GetNumberOfPages(_filtered, noOfRows);

		setCurPage(1);
		setNumberOfPages(_numberOfPages);
		setPageList(_pageList);
	}, [filterText]);

	const GetPageList = (_list, _page = curPage) => {
		return _list.slice((_page - 1) * noOfRows, _page * noOfRows);
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
					<Stack spacing={2} overflow={'auto'}>
						<HeaderBox>
							<SearchInput filterState={{filterText, setFilterText}} helperText={helperText} />
						</HeaderBox>
						<AppTableContainer>
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
										isValidating === true &&
										<TableRow>
											<TableCell colSpan={4} align={"center"}>
												<CircularProgress />
											</TableCell>
										</TableRow>
									}
									{
										(isValidating === false && pageList.length <= 0) &&
										<TableRow>
											<TableCell colSpan={4} align={"center"}>
												Cannot find list :(
											</TableCell>
										</TableRow>
									}
									{
										(isValidating === false && pageList.length > 0) &&
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
						</AppTableContainer>
					</Stack>
					<AppPagination pageState={{curPage, setCurPage}} total={numberOfPages} />
				</Stack>
			</AppBody>
			<MainSnackbar open={alertOpen} onClose={OnAlertClosed} severity={severity} text={alertMessage} />
		</>
	)
}

export default Commands;