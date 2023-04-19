import React from "react";
import useSWRImmutable from "swr/immutable";
import AppBody from "../../components/AppBody";
import AppPagination from "../../components/AppPagination";
import {COUNTDOWN_CARD_TYPE_ADD, COUNTDOWN_CARD_TYPE_COUNTDOWN, GetNumberOfPages} from "../../Utils";
import {Box, Grid, Stack} from "@mui/material";
import SearchInput from "../../components/SearchInput";
import HeaderBox from "../../components/HeaderBox";
import {differenceInDays, format} from "date-fns";
import CountdownCard from "../../components/CountdownCard";

const noOfColumns = 4;
const helperText = "Search for a specific Countdown via Name";

const fetcher = (...args) => fetch(...args).then(res => res.json());

function Countdowns ()
{
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
					Date: `${format(date, "d MMMM y")} (${diff > 0 ? `${diff} Days Left` : "Out Now!"})`,
					CardType: COUNTDOWN_CARD_TYPE_COUNTDOWN
				}
			});
			_numberOfPages = GetNumberOfPages(_list, noOfColumns);
		}

		_list.push({
			Name: "",
			Date: "",
			Description: "",
			Image: "",
			URL: "",
			CardType: COUNTDOWN_CARD_TYPE_ADD
		});

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

		let _filtered = countdownList.filter(c => c.Name.toLowerCase().includes(filterText.toLowerCase()) || c.CardType === COUNTDOWN_CARD_TYPE_ADD);

		let _pageList = GetPageList(_filtered, 1);
		let _numberOfPages = GetNumberOfPages(_filtered, noOfColumns);

		setCurPage(1);
		setNumberOfPages(_numberOfPages);
		setPageList(_pageList);
	}, [filterText]);

	const GetPageList = (_list, _page = curPage) => {
		return _list.slice((_page - 1) * noOfColumns, _page * noOfColumns);
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
			</AppBody>
		</>
	)
}

export default Countdowns;