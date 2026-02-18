import {Button, Stack} from "@mui/material";
import AppBody from "../../components/AppBody";
import React from "react";
import {Add} from "@mui/icons-material";
import {ModalContext} from "../../contexts/ModalContext";
import useSWR from "swr";
import LoadingBox from "../../components/LoadingBox";
import RecipeCard from "../../components/RecipeCard";
import HeaderBox from "../../components/HeaderBox";
import SearchInput from "../../components/SearchInput";
import { AddRecipeModalChild } from "../../components/Modals/AddRecipeModalChild";
import { ApiFetcher, ExecuteAuthAction } from "../../Utils";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";

const helperText = "Search for a specific Recipe";

function Recipes(props)
{
	const { data, isValidating, mutate } = useSWR("/api/recipeList", ApiFetcher);

	const modalStates = React.useContext(ModalContext);
	const { authed, setAuthed } = React.useContext(AuthenticationContext);

	// Filter States
	const [filterText, setFilterText] = React.useState("");

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
    
	React.useEffect(() => {
		if (authed !== true) return;
        
        OpenAddRecipe();
		setAuthed(false);
	}, [authed]);

	return (
		<>
			<AppBody>
				{
					isValidating === true &&
					<LoadingBox />
				}
				{
					isValidating !== true &&
					<Stack spacing={1} height='100%'>
                        <HeaderBox>
                            <SearchInput filterState={{filterText, setFilterText}} helperText={helperText} />
                        </HeaderBox>
						<Stack direction={"row"} spacing={1} paddingTop={1} paddingBottom={1}>
							<Button variant={"contained"} onClick={OnAddRecipe}>
								<Add fontSize="small" />&nbsp;Add New Recipe
							</Button>
						</Stack>
                        <Stack gap={1}>
                            {
                                data !== undefined &&
                                data.map((d) => <RecipeCard key={`recipe-${d.Id}`} recipe={d} />)
                            }
                        </Stack>
					</Stack>
				}
			</AppBody>
		</>
	)
}

export default Recipes;