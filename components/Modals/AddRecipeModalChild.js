import { Box, Button, Checkbox, Chip, Collapse, Divider, FormControlLabel, FormGroup, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, TextField, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import { arrayMove, List as MovableList } from "react-movable";
import styled from "@emotion/styled";
import { ModalContext } from "../../contexts/ModalContext";
import { Fetch, HTTPMethod, SetErrorSnackbar } from "../../Utils";
import { Add, Close, Delete, Done, Edit, ExpandLess, ExpandMore } from "@mui/icons-material";

const StepListItem = styled(ListItem)`
    border: 1px solid #0E4686;
    border-radius: 8px;

    background: #3e6a9e;
    color: white;
    cursor: pointer;
`;

const CollapsibleListItem = (props) => {
    const { index, label, isEditing, onEdit, onEditCancel, onSubmit, onDelete, isAddRecipe } = props;

    const [workingLabel, setWorkingLabel] = useState(label);

    const OnTextChanged = useCallback((e) => {
        setWorkingLabel(e.target.value);
    });

    return (
        <Paper sx={{ px: 2, border: "1px solid #aaa", background: "linear-gradient(90deg, #222, #444, #222) !important" }}>
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                {
                    isEditing 
                    ? (
                        <TextField size={"small"} fullWidth sx={{ px: 0 }} value={workingLabel} onChange={OnTextChanged} autoFocus />
                    )
                    : (
                        <FormGroup>
                            <FormControlLabel sx={{ color: "white" }} control={<Checkbox sx={{ display: isAddRecipe ? "none" : "block" }} />} label={workingLabel} />
                        </FormGroup>
                    )
                }
                <Stack direction={"row"}>
                    {
                        isEditing
                        ? (
                            <>
                                <IconButton onClick={() => onSubmit(index, workingLabel)}>
                                    <Done htmlColor="white" />
                                </IconButton>
                                <IconButton onClick={onEditCancel}>
                                    <Close htmlColor="white" />
                                </IconButton>
                            </>
                        )
                        : (
                            <>
                                <IconButton onClick={onEdit}>
                                    <Edit htmlColor="white" />
                                </IconButton>
                                <IconButton onClick={onDelete}>
                                    <Delete htmlColor="white" />
                                </IconButton>
                            </>
                        )
                    }
                </Stack>
            </Stack>
        </Paper>
    )
}

const CollapsibleList = (props) => {
    const { title, listItems, setListItems, isAddRecipe } = props;

    const [open, setOpen] = useState(true);
    const [editIndex, setEditIndex] = useState([]);

    const OnToggleOpen = useCallback(() => {
        setOpen(!open);
    });

    const OnAddClicked = useCallback(() => {
        const newListItems = [...listItems];
        newListItems.push("");
        setListItems(newListItems);

        const newEditIndex = [...editIndex];
        newEditIndex.push(newListItems.length - 1);
        setEditIndex(newEditIndex);

        setOpen(true);
    });

    const OnDeleteClicked = useCallback((itemToDelete) => {
        const newListItems = [...listItems];
        const delInd = newListItems.indexOf(itemToDelete);
        newListItems.splice(delInd, 1);
        setListItems(newListItems);
    });

    const OnEditClicked = useCallback((index) => {
        const newEditIndex = [...editIndex];
        newEditIndex.push(index);
        setEditIndex(newEditIndex);
    });

    const OnEditCancelClicked = useCallback((index) => {
        const newEditIndex = [...editIndex];
        const arrIndex = newEditIndex.indexOf(index);
        newEditIndex.splice(arrIndex, 1);
        setEditIndex(newEditIndex);
    });

    const OnSubmitClicked = useCallback((index, newItem) => {
        const newListItems = [...listItems];
        newListItems[index] = newItem;
        setListItems(newListItems);

        OnEditCancelClicked(index);
    });

    return (
        <>
            <Box>
                <List>
                    <ListItemButton onClick={OnToggleOpen} sx={{ borderBottom: '1px solid #777' }}>
                        <ListItemText sx={{ color: "white" }} primary={title} />
                        {open ? <ExpandLess htmlColor={"white"} /> : <ExpandMore htmlColor={"white"} />}
                    </ListItemButton>
                </List>
                <Collapse in={open}>
                    {
                        listItems &&
                        <Stack gap={1}>
                            {
                                listItems.map((li, index) => <CollapsibleListItem key={index} index={index} label={li}
                                    isAddRecipe={isAddRecipe}
                                    isEditing={editIndex.includes(index)}
                                    onEdit={() => OnEditClicked(index)}
                                    onEditCancel={() => OnEditCancelClicked(index)}
                                    onDelete={() => OnDeleteClicked(li)} 
                                    onSubmit={OnSubmitClicked} />)
                            }
                        </Stack>
                    }
                </Collapse>
            </Box>
            <Button variant={"contained"} size={"small"} startIcon={<Add />} sx={{ width: "fit-content" }} onClick={OnAddClicked}>
                Add {title}
            </Button>
        </>
    )
}

/*
{
            name: recipeName, 
            ingredients: ingredients,
            steps: steps,
            username: userName
        }
*/

export function AddRecipeModalChild(props) {
	const { recipe } = props;

    const modalStates = React.useContext(ModalContext);

    const [recipeName, setRecipeName] = React.useState(modalStates.modalProps?.name ?? "");
    const [ingredients, setIngredients] = React.useState(modalStates.modalProps?.ingredients ?? []);
    const [steps, setSteps] = React.useState(modalStates.modalProps?.steps ?? []);

    React.useEffect(() => {
        modalStates.setModalProps({
            name: recipeName,
            ingredients: ingredients,
            steps: steps
        });
    }, [recipeName, ingredients, steps]);

    const OnNameChanged = useCallback((e) => {
        setRecipeName(e.target.value);
    });
    
	return (
        <Stack gap={1} justifyContent={"space-between"}>
            <Box>
                <Stack gap={1}>
                    <Typography color={"white"}>Name</Typography>
                    <TextField size={"small"} variant={"outlined"} value={recipeName} onChange={OnNameChanged} />
                </Stack>
                <Stack gap={1}>
                    <CollapsibleList title={"Ingredient"} listItems={ingredients} setListItems={setIngredients} isAddRecipe={!recipe}>
                    </CollapsibleList>
                </Stack>
                <Stack gap={1}>
                    <CollapsibleList title={"Step"} listItems={steps} setListItems={setSteps} isAddRecipe={!recipe}>
                    </CollapsibleList>
                </Stack>
            </Box>
        </Stack>
	)
}