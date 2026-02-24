import {Button, CircularProgress, IconButton, Stack, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import AppBody from "../../components/AppBody";
import React, { useCallback } from "react";
import {Add, Delete as DeleteIcon, RecentActorsRounded} from "@mui/icons-material";
import {ModalContext} from "../../contexts/ModalContext";
import useSWR from "swr";
import LoadingBox from "../../components/LoadingBox";
import HeaderBox from "../../components/HeaderBox";
import SearchInput from "../../components/SearchInput";
import { AddRecipeModalChild } from "../../components/Modals/AddRecipeModalChild";
import { ApiFetcher, ExecuteAuthAction, Fetch, HTTPMethod, SetErrorSnackbar } from "../../Utils";
import usePagination from "../../hooks/usePagination";
import AppPagination from "../../components/AppPagination";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import ViewRecipeModalChild from "../../components/Modals/ViewRecipeModalChild";

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

const TestAction = () => {
	const modalStates = React.useContext(ModalContext);

	const OnSaveClicked = () => {
        const userName = sessionStorage.getItem("DiscordUserName");
		const savePayload = modalStates.modalProps;
		console.log(modalStates);

		// Fetch(HTTPMethod.POST, './api/addRecipe', {
		// 	...savePayload,
		// 	username: userName
		// }
		// ).then((resp) => {
		// 	mutate();
		// }).catch((e) => {
		// 	SetErrorSnackbar(snackbarStates, e.response.data.message);
		// }).finally(modalStates.CloseModal);
	};

	return (
		<Button variant={"contained"} onClick={OnSaveClicked}>Save</Button>
	);
}

function Recipes(props)
{
	const { data, isValidating, mutate } = useSWR("/api/recipeList", ApiFetcher);

	const modalStates = React.useContext(ModalContext);
	const snackbarStates = React.useContext(SnackbarContext);

	// Filter States
	const [filterText, setFilterText] = React.useState("");
	const [filteredData, setFilteredData] = React.useState([]);

	const { curPage, setCurPage, numberOfPages, pageList } = usePagination(7, data, filteredData, setFilteredData, filterText, transformListItem, filterPredicate);

	React.useEffect(() => {
		console.log(modalStates.modalProps);
	}, [modalStates.modalProps]);

	const OnSaveClicked = () => {
        const userName = sessionStorage.getItem("DiscordUserName");
		const savePayload = modalStates.modalProps;
		console.log(modalStates);

		// Fetch(HTTPMethod.POST, './api/addRecipe', {
		// 	...savePayload,
		// 	username: userName
		// }
		// ).then((resp) => {
		// 	mutate();
		// }).catch((e) => {
		// 	SetErrorSnackbar(snackbarStates, e.response.data.message);
		// }).finally(modalStates.CloseModal);
	};

    const OnAddRecipe = () => {
		ExecuteAuthAction(() => {
			modalStates.OpenModal({
				title: "Add Recipe",
				height: "500px",
				maxWidth: "sm",
				children: <AddRecipeModalChild />,
				actions: <TestAction />,
				props: {
					name: "",
					ingredients: [],
					steps: []
				}
			});
		}, modalStates, mutate);
    }

	const OnOpenRecipe = (recipeId) => {
		const recipe = data.find(r => r.Id === recipeId);
		modalStates.OpenModal({
			title: recipe.Name,
			children: <ViewRecipeModalChild recipe={recipe} />
		});
	}

	const OnDeleteRecipe = (recipeId) => {
		ExecuteAuthAction(() => {
			const recipe = data.find(r => r.Id === recipeId);
			const username = sessionStorage.getItem("DiscordUserName");
			if (username !== recipe.AddedBy)
			{
				SetErrorSnackbar(snackbarStates, "Cannot delete someone else's recipe");
				return;
			}

			modalStates.OpenConfirmationModal({
				title: "Confirm Delete Recipe?",
				message: `Are you sure you want to delete this Recipe: ${recipe.Name}`,
				callback: () => {
					Fetch(HTTPMethod.POST, "./api/deleteRecipe", { id: recipe.Id, username: username })
					.then((resp) => {
						mutate();
					});
				}
			});
		}, modalStates, mutate);
	}

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
															<TableCell sx={{ cursor: "pointer" }} onClick={() => OnOpenRecipe(r.Id)}>
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