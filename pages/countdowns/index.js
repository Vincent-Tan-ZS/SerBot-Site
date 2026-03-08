import React from "react";
import useSWRImmutable from "swr/immutable";
import AppBody from "../../components/AppBody";
import AppPagination from "../../components/AppPagination";
import {ApiFetcher} from "../../Utils";
import {Box, Grid, IconButton, Stack, Tooltip} from "@mui/material";
import SearchInput from "../../components/SearchInput";
import HeaderBox from "../../components/HeaderBox";
import {differenceInDays, format, isAfter} from "date-fns";
import CountdownCard from "../../components/CountdownCard";
import {MobileContext} from "../../contexts/MobileContext";
import { ClearAll, Sort as SortIcon } from "@mui/icons-material";
import LoadingBox from "../../components/LoadingBox";
import usePagination from "../../hooks/usePagination";

const noOfCards = 4;
const helperText = "Search for a specific Countdown via Name";

const transformListItem = (cd) => {
	let date = new Date(cd.Date);
	let diff = differenceInDays(date, new Date());

	return {
		...cd,
		Date: `${format(date, "d MMMM y")} (${diff > 0 ? `${diff} Days Left` : "Out Now!"})`
	}
};
const filterPredicate = (cd, filterText) => cd.Name.toLowerCase().includes(filterText.toLowerCase());
const sortPredicate = (a, b) => {
	const aDate = new Date(a.Date);
	const bDate = new Date(b.Date);

	return isAfter(aDate, bDate) ? 1 : -1;
}

function Countdowns ()
{
	const { data, isValidating } = useSWRImmutable("/api/countdowns", ApiFetcher)
	const isMobile = React.useContext(MobileContext);

	const [countdownList, setCountdownList] = React.useState([]);

	// Filter States
	const [filterText, setFilterText] = React.useState("");

	// Sorting States
	const [sortByDate, setSortByDate] = React.useState(false);

	const { curPage, setCurPage, numberOfPages, pageList } = usePagination(noOfCards, data, countdownList, setCountdownList, filterText, transformListItem, filterPredicate, sortByDate ? sortPredicate : undefined);

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
								<Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
									<SearchInput filterState={{filterText, setFilterText}} helperText={helperText} />
									<Tooltip title={sortByDate === true ? "Unsort" : "Sort by release date"} placement="top">
										<IconButton sx={{marginLeft: 1}} onClick={OnSortClicked}>
											{
												sortByDate &&
												<ClearAll fontSize={"large"} htmlColor={"white"} />
											}
											{
												!sortByDate &&
												<SortIcon fontSize={"large"} htmlColor={"white"} />
											}
										</IconButton>
									</Tooltip>
								</Stack>
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