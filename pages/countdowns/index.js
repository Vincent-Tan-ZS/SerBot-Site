import React from "react";
import useSWRImmutable from "swr/immutable";
import AppBody from "../../components/AppBody";
import AppPagination from "../../components/AppPagination";
import {CopyToClipboard, GetNumberOfPages} from "../../Utils";
import {Box, Card, CardActions, CardContent, CardMedia, Grid, IconButton, Stack, Tooltip, Typography, styled} from "@mui/material";
import {Link as LinkIcon, Delete as DeleteIcon, BrokenImage as BrokenImageIcon, Edit as EditIcon} from '@mui/icons-material';
import SearchInput from "../../components/SearchInput";
import HeaderBox from "../../components/HeaderBox";
import {differenceInDays, format} from "date-fns";

const cardMediaHeight = '140px';

const CountdownCard = styled(Card)`
	box-shadow: 0px 0px 8px 4px #0E4686;
	background-color: #24252C;
	color: white;
	height: 500px;

	display: flex;
	flex-direction: column;
	justify-content: space-between;

	:hover {
		box-shadow: 0px 0px 8px 8px #3e6a9e;
	}

	.MuiCardMedia-root {
		height: ${cardMediaHeight};
		width: 100%;
	}

	.MuiCardActions-root {
		justify-content: space-between;
	}
`;

const CountdownImage = (props) => {
	let spanStyle = {
		display: 'block',
		padding: '4px',
		background: '#303436'
	};

	// if (props.src.length > 0)
	// {
	// 	spanStyle.background = `url(${props.src})`;
	// 	spanStyle.backgroundSize = '300px 100px';
	// 	spanStyle.backgroundPositionX = 'center';
	// 	spanStyle.backgroundPositionY = 'center';
	// }

	return (
		<span style={spanStyle}>
			{
				props.src?.length > 0 &&
				<CardMedia {...props} />
			}
			{
				props.src?.length <= 0 &&
				<Box height={cardMediaHeight} width={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
					<BrokenImageIcon sx={{fontSize: "5rem"}} />
					<Typography>No Image Added</Typography>
				</Box>
			}
		</span>
	)
}

const noOfColumns = 4;
const descLength = 300;
const helperText = "Search for a specific Countdown via Name";

const fetcher = (...args) => fetch(...args).then(res => res.json());

function Countdowns (props)
{
	const { snackbarStates } = props;

	const { data, isValidating } = useSWRImmutable("/api/countdowns", fetcher)
	const [countdownList, setCountdownList] = React.useState([]);

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
				let date = new Date(l.Date);
				let diff = differenceInDays(date, new Date());

				return {
					...l,
					Date: `${format(date, "d MMMM y")} (${diff > 0 ? `${diff} Days Left` : "Out Now!"})`
				}
			});
			_numberOfPages = GetNumberOfPages(_list, noOfColumns);
		}

		setCountdownList(_list);
		setNumberOfPages(_numberOfPages);
	}, [data]);

	React.useEffect(() => {
		if (countdownList.length <= 0) return;

		let _pageList = GetPageList(countdownList);
		setPageList(_pageList);
	}, [countdownList, curPage]);

	React.useEffect(() => {
		if (countdownList.length <= 0) return;

		let _filtered = countdownList.filter(c => c.Name.toLowerCase().includes(filterText.toLowerCase()));

		let _pageList = GetPageList(_filtered, 1);
		let _numberOfPages = GetNumberOfPages(_filtered, noOfColumns);

		setCurPage(1);
		setNumberOfPages(_numberOfPages);
		setPageList(_pageList);
	}, [filterText]);

	const GetPageList = (_list, _page = curPage) => {
		return _list.slice((_page - 1) * noOfColumns, _page * noOfColumns);
	}

	const OnDeleteClicked = (cdName) => () => {
		CopyToClipboard(snackbarStates, `ser cd delete ${cdName}`);
	}

	const OnEditClicked = (cdName) => () => {
		CopyToClipboard(snackbarStates, `ser cd update ${cdName}`);
	}

	const OnLinkClicked = (cdLink) => () => {
		window.open(cdLink, "_blank");
	}

	return (
		<>
			<AppBody>
				<Stack spacing={1} flexDirection={"column"} height={"100%"} justifyContent={"space-between"}>
					<Stack spacing={2} overflow={'auto'} height={"100%"}>
						<HeaderBox>
							<SearchInput filterState={{filterText, setFilterText}} helperText={helperText} />
						</HeaderBox>
						<Box height={"100%"} style={{marginLeft: '32px', marginRight: '32px'}}>
							{
								<Grid container spacing={3}>
									{
										pageList.map((c, ind) => {
											return (
												<Grid key={`countdown-card-${ind}-${c.Name}`} item xs={3}>
													<CountdownCard>
														<Box>
															<CountdownImage component={"img"} src={c.Image} title={c.Name} />
															<CardContent>
																<Typography variant={"h6"} fontWeight={"bold"}>{c.Name}</Typography>
																<Typography fontStyle={"italic"}>{c.Date}</Typography>
																<Typography>{c.Description?.length > descLength ? `${c.Description.substring(0, descLength)}...` : c.Description}</Typography>
															</CardContent>
														</Box>
														<CardActions>
															<Stack direction={"row"} gap={1} justifyContent={"space-between"} width={"100%"}>
																<Box>
																	<Tooltip title={"Copy update command"}>
																		<IconButton color={"primary"} onClick={OnEditClicked(c.Name)}>
																			<EditIcon />
																		</IconButton>
																	</Tooltip>
																	<Tooltip title={"Copy delete command"}>
																		<IconButton color={"primary"} onClick={OnDeleteClicked(c.Name)}>
																			<DeleteIcon />
																		</IconButton>
																	</Tooltip>
																</Box>
																{
																	c.URL?.length > 0 &&
																	<Tooltip title={"Visit Countdown URL"}>
																		<IconButton color={"primary"} onClick={OnLinkClicked(c.URL)}>
																			<LinkIcon />
																		</IconButton>
																	</Tooltip>
																}
															</Stack>
														</CardActions>
													</CountdownCard>
												</Grid>
											)
										})
									}
								</Grid>
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