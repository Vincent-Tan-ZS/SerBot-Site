import React from "react";
import useSWRImmutable from "swr/immutable";
import AppBody from "../../components/AppBody";
import AppPagination from "../../components/AppPagination";
import {ChunkArray, GetNumberOfPages} from "../../Utils";
import {Box, Button, Card, CardActions, CardContent, CardMedia, Grid, IconButton, Stack, Typography, styled} from "@mui/material";
import {Link as LinkIcon} from '@mui/icons-material';
import SearchInput from "../../components/SearchInput";
import HeaderBox from "../../components/HeaderBox";
import {format} from "date-fns";

const CountdownCard = styled(Card)`	
	background-color: rgb(24, 26, 27);
	color: white;
	height: 300px;

	display: flex;
	flex-direction: column;
	justify-content: space-between;

	.MuiCardMedia-root {
		height: 100px;
		width: 100%;
	}

	.MuiCardActions-root {
		justify-content: space-between;
	}
`;

const CountdownImage = (props) => {
	return (
		<span style={{display: 'flex', justifyContent: 'center', padding: '4px', background:'#303436'}}>
			<CardMedia {...props} />
		</span>
	)
}

const noOfRows = 3;
const noOfColumns = 4;
const descLength = 130;
const helperText = "Search for a specific Countdown";

const fetcher = (...args) => fetch(...args).then(res => res.json());

function Countdowns ()
{
	const { data, isValidating } = useSWRImmutable("/api/countdowns", fetcher)
	const [countdownList, setCountdownList] = React.useState([]);
	const [chunkedList, setChunkedList] = React.useState([]);

	// Filter States
	const [filterText, setFilterText] = React.useState("");

	// Pagination States
	const [curPage, setCurPage] = React.useState(1);
	const [numberOfPages, setNumberOfPages] = React.useState(1);
	const [pageList, setPageList] = React.useState([]);

	React.useEffect(() => {
		let _list = [];
		let _numberOfPages = 0;

		if (data !== undefined)
		{
			_list = data.map((l) => {
				return {
					...l,
					Date: format(new Date(l.Date), "d MMMM y")
				}
			});
			_numberOfPages = GetNumberOfPages(_list, noOfRows, noOfColumns);
		}

		setCountdownList(_list);
		setNumberOfPages(_numberOfPages);
	}, [data]);

	React.useEffect(() => {
		const _chunked = ChunkArray(pageList, noOfColumns);
		setChunkedList(_chunked);
	}, [pageList]);

	React.useEffect(() => {
		if (countdownList.length <= 0) return;

		let _pageList = GetPageList(countdownList);
		setPageList(_pageList);
	}, [countdownList, curPage]);

	React.useEffect(() => {
		if (countdownList.length <= 0) return;

		let _filtered = countdownList.filter(c => c.Name.toLowerCase().includes(filterText.toLowerCase()) || 
												c.Description.toLowerCase().includes(filterText.toLowerCase()));

		// let _pageList = GetPageList(_filtered, 1);
		// let _numberOfPages = GetNumberOfPages(_filtered, noOfRows, noOfColumns);

		// setCurPage(1);
		// setNumberOfPages(_numberOfPages);
		// setPageList(_pageList);
	}, [filterText]);

	const GetPageList = (_list, _page = curPage) => {
		return _list.slice((_page - 1) * noOfRows, _page * noOfRows);
	}

	// const OnAlertClosed = () => {
	// 	setOpenAlert(false);
	// }

	const OnDeleteClicked = (cdName) => () => {
		let _msg = "";
		let _severity = "warning";

		try
		{
			navigator.clipboard.writeText(`ser cd delete ${cdName}`);
			_msg = "Copied to Clipboard";
			_severity = "info";
		}
		catch (e)
		{
			_msg = "Unable to Copy to Clipboard";
			_severity = "error";
		}

		// setAlertMessage(_msg);
		// setSeverity(_severity);
		// setOpenAlert(true);
	}

	const OnLinkClicked = (cdLink) => () => {
		window.open(cdLink, "_blank");
	}

	return (
		<>
			<AppBody>
				<Stack spacing={1} flexDirection={"column"} height={"100%"} justifyContent={"space-between"}>
					<Stack spacing={2} overflow={'auto'}>
						<HeaderBox>
							<SearchInput filterState={{filterText, setFilterText}} helperText={helperText} />
						</HeaderBox>
						<Box>
							{
								chunkedList.map((row, rowInd) => {
									return (
										<Grid paddingBottom={2} key={`countdown-row-${rowInd}`} container spacing={2}>
											{
												row.map((c, ind) => {
													return (
														<Grid key={`countdown-card-${rowInd}-${ind}`} item xs={3}>
															<CountdownCard elevation={8}>
																<Box>
																	<CountdownImage component={"img"} src={c.Image} title={c.Name} />
																	<CardContent>
																		<Typography variant={"h6"} fontWeight={"bold"}>{c.Name}</Typography>
																		<Typography fontStyle={"italic"}>{c.Date}</Typography>
																		<Typography>{c.Description?.length > descLength ? `${c.Description.substring(0, descLength)}...` : c.Description}</Typography>
																	</CardContent>
																</Box>
																<CardActions>
																	<Stack direction={"row"} gap={1}>
																		<Button size={"small"} variant={"contained"} onClick={OnDeleteClicked(c.Name)}>Delete</Button>
																		{
																			c.URL?.length > 0 &&
																			<IconButton color={"primary"} onClick={OnLinkClicked(c.URL)}>
																				<LinkIcon />
																			</IconButton>
																		}
																	</Stack>
																</CardActions>
															</CountdownCard>
														</Grid>
													)
												})
											}
										</Grid>
									);
								})
							}
						</Box>
					</Stack>
					<AppPagination pageState={{curPage, setCurPage}} page={curPage} total={numberOfPages} />
				</Stack>
			</AppBody>
		</>
	)
}

export default Countdowns;