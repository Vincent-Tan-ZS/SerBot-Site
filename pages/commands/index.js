import {CircularProgress, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";
import { ContentCopy as CopyIcon } from '@mui/icons-material';
import React from "react";
import AppBody from "../../components/AppBody";
import useSWRImmutable from "swr/immutable"; 
import {ApiFetcher, CopyToClipboard } from "../../Utils";
import SearchInput from "../../components/SearchInput";
import AppPagination from "../../components/AppPagination";
import AppTableContainer from "../../components/AppTableContainer";
import HeaderBox from "../../components/HeaderBox";
import {SnackbarContext} from "../../contexts/SnackbarContext";
import {ModalContext} from "../../contexts/ModalContext";
import {CopyCommandsModalChild} from "../../components/Modals/CopyCommandsModalChild";
import LoadingBox from "../../components/LoadingBox";
import usePagination from "../../hooks/usePagination";

const helperText = "Search for a specific Command via Title or Description";

const transformListItem = (li) => {
	let _usage = li.Usage.map(u => `ser ${li.List[0]} ${u}`.trim());
	
	return {
		Title: li.Title,
		List: li.List,
		Description: li.Description,
		Usage: _usage
	}
};

const filterPredicate = (c, filterText) => c.Title.toLowerCase().includes(filterText.toLowerCase()) || c.List.find(l => l.toLowerCase().includes(filterText.toLowerCase())) !== undefined;

function Commands() {
	const snackbarStates = React.useContext(SnackbarContext);
	const modalStates = React.useContext(ModalContext);

	// List States
	const { data, isValidating } = useSWRImmutable(`/api/command`, ApiFetcher)
	const [commandList, setCommandList] = React.useState([]);

	// Filter States
	const [filterText, setFilterText] = React.useState("");

	const { curPage, setCurPage, numberOfPages, pageList } = usePagination(10, data, commandList, setCommandList, filterText, transformListItem, filterPredicate); 

	const OnCopyClicked = (list) => () => {
		const matches = list.match(/{.+?}|@\w+|[[]\w+?]/g);

		if (matches === null)
		{
			CopyToClipboard(snackbarStates, list);
		}
		else
		{
			const mentions = matches.filter(m => m.startsWith("@"));
			const days = matches.filter(m => m.startsWith("["));
			const options = matches.filter(m => m.startsWith("{"));

			modalStates.setModalTitle("Copy Command");
			modalStates.setModalMaxWidth("md");
			modalStates.setModalChildren(<CopyCommandsModalChild command={list} options={options} mentions={mentions} days={days} />);
			modalStates.setModalOpen(true);
		}
	}

	return (
		<>
			<AppBody>
				{
					isValidating === true &&
					<LoadingBox />
				}
				{
					isValidating !== true &&
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
				}
			</AppBody>
		</>
	)
}

export default Commands;