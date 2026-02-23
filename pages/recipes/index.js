import {Button, CircularProgress, IconButton, Stack, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import AppBody from "../../components/AppBody";
import React from "react";
import {Add, Delete as DeleteIcon} from "@mui/icons-material";
import {ModalContext} from "../../contexts/ModalContext";
import useSWR from "swr";
import LoadingBox from "../../components/LoadingBox";
import RecipeCard from "../../components/RecipeCard";
import HeaderBox from "../../components/HeaderBox";
import SearchInput from "../../components/SearchInput";
import { AddRecipeModalChild } from "../../components/Modals/AddRecipeModalChild";
import { ApiFetcher, ExecuteAuthAction } from "../../Utils";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import usePagination from "../../hooks/usePagination";
import AppPagination from "../../components/AppPagination";

const helperText = "Search for a specific Recipe via name or ingredient";

const RecipeTable = styled(TableContainer)`
	.MuiTable-root {
		border: 1px solid #1A7AFF;
	}

	.MuiTableCell-root {
		border-color: #1A7AFF;
	}

	.MuiTableRow-root {
		background: linear-gradient(90deg, #111F42 0%, #111F42 50%, transparent 100%);
	}
`;

const transformListItem = (r) => r;

const filterPredicate = (r, filterText) => r.Name.toLowerCase().includes(filterText.toLowerCase()) || r.Ingredients.some(i => i.toLowerCase().includes(filterText.toLowerCase()));

function Recipes(props)
{
	const { data, isValidating, mutate } = useSWR("/api/recipeList", ApiFetcher);

	const modalStates = React.useContext(ModalContext);
	const { authed, setAuthed } = React.useContext(AuthenticationContext);

	// Filter States
	const [filterText, setFilterText] = React.useState("");
	const [filteredData, setFilteredData] = React.useState([]);

	const { curPage, setCurPage, numberOfPages, pageList } = usePagination(7, data, filteredData, setFilteredData, filterText, transformListItem, filterPredicate); 

    const OpenAddRecipe = () => {
		modalStates.setModalTitle("Add Recipe");
		modalStates.setModalHeight("500px");
		modalStates.setModalChildren(<AddRecipeModalChild refresh={mutate} />);
    }

    const OnAddRecipe = () => {
		ExecuteAuthAction(() => {
			modalStates.setModalOpen(true);
			OpenAddRecipe();
		}, modalStates, mutate);
    }

	const OnDeleteRecipe = (recipeId) => {
		// alert(recipeId);
	}
    
	React.useEffect(() => {
		if (authed !== true) return;
        
        OpenAddRecipe();
		setAuthed(false);
	}, [authed]);

	React.useEffect(() => {
		setFilteredData(data);
	}, [data]);

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
						<Stack spacing={1} height='100%'>
							<HeaderBox>
								<SearchInput filterState={{filterText, setFilterText}} helperText={helperText} />
							</HeaderBox>
							<Stack direction={"row"} spacing={1} paddingTop={1} paddingBottom={1}>
								<Button variant={"contained"} onClick={OnAddRecipe}>
									<Add fontSize="small" />&nbsp;Add New Recipe
								</Button>
							</Stack>
								<RecipeTable>
									<Table size={"small"}>
										<TableHead>
											<TableRow>
												<TableCell>
													<Typography color={"white"}>Name</Typography>
												</TableCell>
												<TableCell width={1} />
											</TableRow>
										</TableHead>
										<TableBody>
											{
												isValidating === true &&
												<TableRow>
													<TableCell colSpan={2} align={"center"}>
														<CircularProgress />
													</TableCell>
												</TableRow>
											}
											{
												(isValidating === false && pageList.length <= 0) &&
												<TableRow>
													<TableCell colSpan={4} align={"center"}>
														No recipes found
													</TableCell>
												</TableRow>
											}
											{
												(isValidating === false && pageList.length > 0) &&
												pageList.map(r => {
													return (
														<TableRow key={`recipe=${r.Name}`}>
															<TableCell>
																<Stack>
																	<Typography color={"white"}>{r.Name} <em style={{fontSize: "12px", color: "gray"}}>by {r.AddedBy}</em></Typography>
																	<Typography color={"white"} variant={"caption"} noWrap sx={{ maxWidth: 600 }}>{r.Ingredients.join(", ")}</Typography>
																</Stack>
															</TableCell>
															<TableCell>
																<IconButton onClick={() => OnDeleteRecipe(r.Id)}>
																	<DeleteIcon color={"error"} />
																</IconButton>
															</TableCell>
														</TableRow>
													)
												})
											}
										</TableBody>
									</Table>
								</RecipeTable>
						</Stack>
						<AppPagination pageState={{curPage, setCurPage}} total={numberOfPages} />
					</Stack>
				}
			</AppBody>
		</>
	)
}

export default Recipes;