import { Button, Chip, Divider, Grid, IconButton, List, ListItem, ListItemText, Stack, TextField } from "@mui/material";
import React from "react";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import { arrayMove, List as MovableList } from "react-movable";
import styled from "@emotion/styled";
import axios from "axios";
import { ModalContext } from "../../contexts/ModalContext";
import { SetErrorSnackbar } from "../../Utils";
import { Delete } from "@mui/icons-material";

const StepListItem = styled(ListItem)`
    border: 1px solid #0E4686;
    border-radius: 8px;

    background: #3e6a9e;
    color: white;
    cursor: pointer;
`;

export function AddRecipeModalChild(props) {
	const { refresh } = props;
	const snackbarStates = React.useContext(SnackbarContext);
	const modalStates = React.useContext(ModalContext);

    const [recipeName, setRecipeName] = React.useState("");
    const [ingredients, setIngredients] = React.useState([]);
    const [steps, setSteps] = React.useState([]);

    const [curIngredient, setCurIngredient] = React.useState("");
    const [curStep, setCurStep] = React.useState("");

    const OnTextChanged = (setValue) => (e, v) => {
        setValue(e.target.value);
    }

    const OnAddList = (curVal, setCurVal, val, setVal) => () => {
        if (curVal.length <= 0) return;
        if (val.includes(curVal) !== true)
        {
            const _val = [...val];
            _val.push(curVal);
            setVal(_val);
        }

        setCurVal("");
    }
    
    const OnDeleteList = (list, val, setVal) => (e, v) => {
        const _val = [...list];
        const delInd = _val.indexOf(val);
        _val.splice(delInd, 1);
        setVal(_val);
    }
	const OnCloseModal = () => {
		modalStates.setModalOpen(false);
	}

    const OnSave = () => {
        const userName = sessionStorage.getItem("DiscordUserName");

        axios.post("./api/addRecipe", {
            name: recipeName, 
            ingredients: ingredients,
            steps: steps,
            username: userName
        }).then((resp) => {
            refresh();
        }).catch((e) => {
			SetErrorSnackbar(snackbarStates, e.response.data.message);
        }).finally(OnCloseModal);
    }
    
    
	return (
		<>
            <Stack gap={1}>
                <TextField size={"small"} required label="Recipe Name" value={recipeName} onChange={OnTextChanged(setRecipeName)} />
                <Divider sx={{borderColor: "gray"}} />
                <Stack gap={1}>
                    <Grid container justifyContent={"space-between"}>
                        <Grid item xs={10}>
                            <TextField size={"small"} label="Ingredient" fullWidth value={curIngredient} onChange={OnTextChanged(setCurIngredient)} />
                        </Grid>
                        <Grid item>
                            <Button variant="contained" fullWidth sx={{height: '100%'}} onClick={OnAddList(curIngredient, setCurIngredient, ingredients, setIngredients)}>Add Ingredient</Button>
                        </Grid>
                    </Grid>
                    <div>
                        {
                            ingredients.map((ing) => <Chip key={`ing-${ing}`} color={"info"} label={ing} size={"small"} onDelete={OnDeleteList(ingredients, ing, setIngredients)} sx={{marginRight: 1}} />)
                        }
                    </div>
                </Stack>
                <Divider sx={{borderColor: "gray"}} />
                <Stack gap={1}>
                    <Grid container justifyContent={"space-between"}>
                        <Grid item xs={10}>
                            <TextField size={"small"} label="Step" fullWidth value={curStep} onChange={OnTextChanged(setCurStep)} />
                        </Grid>
                        <Grid item>
                            <Button variant="contained" fullWidth sx={{height: '100%'}} onClick={OnAddList(curStep, setCurStep, steps, setSteps)}>Add Step</Button>
                        </Grid>
                    </Grid>
                    {
                        steps.length > 0 &&
                        <>
                            <em style={{color: "white"}}>List is sortable by dragging & dropping</em>
                            <MovableList values={steps} onChange={({ oldIndex, newIndex }) =>
                                    setSteps(arrayMove(steps, oldIndex, newIndex))
                                }
                                renderList={({ children, props }) => <List {...props}>{children}</List>}
                                renderItem={({ value, index, props }) => <StepListItem secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={OnDeleteList(steps, value, setSteps)}>
                                      <Delete />
                                    </IconButton>
                                  } {...props}> <ListItemText>{index + 1}. {value}</ListItemText> </StepListItem>} 
                            />
                        </>
                    }
                </Stack>
                <Divider sx={{borderColor: "gray"}} />
                <Button variant={"contained"} onClick={OnSave}>Save</Button>
            </Stack>
		</>
	)
}