import React from "react";
import useSWRImmutable from "swr/immutable";
import AppBody from "../../components/AppBody";
import AppPagination from "../../components/AppPagination";
import {ApiFetcher, GetNumberOfPages} from "../../Utils";
import {Box, Grid, IconButton, Stack, Tooltip} from "@mui/material";
import SearchInput from "../../components/SearchInput";
import HeaderBox from "../../components/HeaderBox";
import {differenceInDays, format, isAfter, parse} from "date-fns";
import CountdownCard from "../../components/CountdownCard";
import {MobileContext} from "../../contexts/MobileContext";
import { ClearAll, Sort as SortIcon } from "@mui/icons-material";
import LoadingBox from "../../components/LoadingBox";

const noOfCards = 4;
const helperText = "Search for a specific Countdown via Name";

function Countdowns ()
{
	const { data, isValidating } = useSWRImmutable("/api/countdowns", ApiFetcher)
	const isMobile = React.useContext(MobileContext);

	const [countdownList, setCountdownList] = React.useState([]);

	// Filter States
	const [filterText, setFilterText] = React.useState("");

	// Pagination States
	const [curPage, setCurPage] = React.useState(1);
	const [numberOfPages, setNumberOfPages] = React.useState(1);
	const [pageList, setPageList] = React.useState([]);
	const [sortByDate, setSortByDate] = React.useState(false);

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
			_numberOfPages = GetNumberOfPages(_list, noOfCards);
		}

		setCountdownList(_list);
		setNumberOfPages(_numberOfPages);
		setCurPage(1);
	}, [data]);

	React.useEffect(() => {
		if (countdownList.length <= 0) return;

		let _filtered = countdownList.filter(c => c.Name.toLowerCase().includes(filterText.toLowerCase()));

		if (sortByDate === true)
		{
			const ConvertDate = (date) => {
				let index = date.indexOf(" (");
				let dateStr = date.substring(0, index);

				return parse(dateStr, "d MMMM y", new Date());
			}

			_filtered = _filtered.sort((a, b) => {
				let aDate = ConvertDate(a.Date);
				let bDate = ConvertDate(b.Date);

				return isAfter(aDate, bDate) ? 1 : -1;
			});
		}

		let _pageList = GetPageList(_filtered);
		let _numberOfPages = GetNumberOfPages(_filtered, noOfCards);

		setNumberOfPages(_numberOfPages);
		setPageList(_pageList);
	}, [countdownList, filterText, sortByDate, curPage]);

	const GetPageList = (_list, _page = curPage) => {
		return _list.slice((_page - 1) * noOfCards, _page * noOfCards);
	}

	const OnSortClicked = () => {
		setSortByDate(!sortByDate);
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
						<Stack spacing={2} overflow={'auto'} height={"100%"}>
							<HeaderBox>
								<SearchInput filterState={{filterText, setFilterText}} helperText={helperText} />
								<Tooltip title={sortByDate === true ? "Unsort" : "Sort by release date"} placement="top">
									<IconButton sx={{marginLeft: 1}} onClick={OnSortClicked}>
										{
											sortByDate &&
											<ClearAll fontSize={"large"} color={"info"} />
										}
										{
											!sortByDate &&
											<SortIcon fontSize={"large"} color={"info"} />
										}
									</IconButton>
								</Tooltip>
							</HeaderBox>
							<Box height={"100%"} style={{marginLeft: '32px', marginRight: '32px'}}>
								{
									<Grid container spacing={3} direction={isMobile === true ? "column" : "row"} height={isMobile === true ? "auto" : "100%"}>
										{
											pageList.map((c, ind) => {
												return (
													<Grid key={`countdown-card-${ind}-${c.Name}`} item xs={3} height={isMobile === true ? "auto" : "100%"}>
														<CountdownCard countdown={c} animationDelay={`${(ind + 1)*0.05}s`} name={filterText} />
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
				}
			</AppBody>
		</>
	)
}

export default Countdowns;