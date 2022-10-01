import {Box, Pagination, Stack, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";
import MainContainer from "../components/MainContainer";
import TextInput from "../components/TextInput";

const CommandsTableContainer = styled(TableContainer)`
	// height: 80vh;

	.MuiTableHead-root {
		.MuiTableCell-root {
			background-color: black;
		}
	}

	.MuiTableCell-root {
		color: white;
	}
`;

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

	return (
		<MainContainer maxWidth={"xl"}>
			<Stack spacing={1} flexDirection={"column"}>
				<HeaderBox>
					<CommandsInput variant="standard" value={filterText} onChange={OnInputChanged} helperText={"Search for a specific Command via Title or Description"} />
				</HeaderBox>
				<CommandsTableContainer>
					<Table stickyHeader>
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
											<TableCell size="small">{li.List.join()}</TableCell>
											<TableCell size="small">{li.Description}</TableCell>
											<TableCell size="small">{li.Usage.join(" | ")}</TableCell>
										</TableRow>
									)
								})
							}
						</TableBody>
					</Table>
				</CommandsTableContainer>
				<CommandsPagination page={curPage} onChange={OnPageChange} count={numberOfPages} color={"primary"} />
			</Stack>
		</MainContainer>
	)
}

export const getServerSideProps = async () => {
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