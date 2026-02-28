import { Box, Button, Checkbox, Chip, Collapse, FormControlLabel, FormGroup, IconButton, List, ListItemButton, ListItemText, Paper, Stack, TextField, Typography } from "@mui/material";
import React, { useCallback, useRef, useState } from "react";
import { ModalContext } from "../../contexts/ModalContext";
import { Add, Close, Delete, Done, Edit, ExpandLess, ExpandMore } from "@mui/icons-material";
import styled from "@emotion/styled";
import { DataCrudType } from "../../Utils";

const StyledCheckbox = styled(Checkbox)`
    .MuiSvgIcon-root {
        color: white;
    }
`;

const CollapsibleListTitle = (props) => {
    const { title, listItems } = props;

    return (
        <Stack direction={"row"} gap={1}>
            {title}s
            {
                listItems?.length > 0 &&
                <Chip color={"secondary"} size={"small"} label={listItems?.length} />
            }
        </Stack>
    )
}

const CollapsibleListItem = (props) => {
    const { index, label, isEditing, onEdit, onEditCancel, onSubmit, onDelete, crudType, inputRefs, onSubmitAndMoveNext } = props;

    const [workingLabel, setWorkingLabel] = useState(label);
    const [originalLabel, setOriginalLabel] = useState(label);

    const OnTextInputKeyDown = useCallback((e) => {
        if (e.key === 'Enter')
        {
            if (onSubmitAndMoveNext) onSubmitAndMoveNext(index, workingLabel);
        }
    }, [onSubmitAndMoveNext, index, workingLabel]);

    const OnSubmit = useCallback(() => {
        if (onSubmit) onSubmit(index, workingLabel)
    }, [onSubmit, index, workingLabel]);

    const OnTextChanged = useCallback((e) => {
        setWorkingLabel(e.target.value);
    }, []);

    const OnEdit = useCallback(() => {
        setOriginalLabel(workingLabel);
        if (onEdit) onEdit();
    }, [workingLabel, onEdit]);

    const OnEditCancel = useCallback(() => {
        setWorkingLabel(originalLabel);
        setOriginalLabel("");
        if (onEditCancel) onEditCancel();
    }, [originalLabel, onEditCancel]);

    return (
        <Paper sx={{ px: 2, border: "1px solid #aaa", background: "linear-gradient(90deg, #222, #444, #222) !important" }}>
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                {
                    isEditing 
                    ? (
                        <TextField size={"small"} fullWidth autoFocus sx={{ px: 0 }} value={workingLabel} inputRef={(el) => inputRefs.current[index] = el}
                            onChange={OnTextChanged} onKeyDown={OnTextInputKeyDown} />
                    )
                    : (
                        <FormGroup sx={{ width: '100%', maxWidth: crudType === DataCrudType.Read ? "100%" : "80%", overflowWrap: "anywhere" }}>
                            <FormControlLabel sx={{ color: "white" }} control={<StyledCheckbox sx={{ display: crudType !== DataCrudType.Read ? "none" : "block" }} />} label={workingLabel} />
                        </FormGroup>
                    )
                }
                {
                    crudType !== DataCrudType.Read &&
                    <Stack direction={"row"}>
                        {
                            isEditing
                            ? (
                                <>
                                    <IconButton onClick={OnSubmit}>
                                        <Done htmlColor="white" />
                                    </IconButton>
                                    <IconButton onClick={OnEditCancel}>
                                        <Close htmlColor="white" />
                                    </IconButton>
                                </>
                            )
                            : (
                                <>
                                    <IconButton onClick={OnEdit}>
                                        <Edit htmlColor="white" />
                                    </IconButton>
                                    <IconButton onClick={onDelete}>
                                        <Delete htmlColor="white" />
                                    </IconButton>
                                </>
                            )
                        }
                    </Stack>
                }
            </Stack>
        </Paper>
    )
}

const CollapsibleList = (props) => {
    const { title, listItems, setListItems, crudType } = props;

    const [open, setOpen] = useState(true);
    const [editIndex, setEditIndex] = useState([]);
    
    const listItemRefs = useRef([]);

    const OnToggleOpen = useCallback(() => {
        setOpen(!open);
    }, [open]);

    const OnAddClicked = useCallback(() => {
        const newListItems = [...listItems];
        newListItems.push("");
        setListItems(newListItems);

        const newEditIndex = [...editIndex];
        newEditIndex.push(newListItems.length - 1);
        setEditIndex(newEditIndex);

        setOpen(true);
    }, [listItems, editIndex]);

    const OnDeleteClicked = useCallback((index) => {
        const newListItems = [...listItems];
        newListItems.splice(index, 1);
        setListItems(newListItems);

        const newEditIndex = [...editIndex];
        for (let i = 0; i < newEditIndex.length; ++i)
        {
            if (newEditIndex[i] <= index) continue;
            newEditIndex[i]--;
        }
        setEditIndex(newEditIndex);
    }, [listItems, editIndex]);

    const OnEditClicked = useCallback((index) => {
        const newEditIndex = [...editIndex];
        newEditIndex.push(index);
        setEditIndex(newEditIndex);
    }, [editIndex]);

    const OnEditCancelClicked = useCallback((index) => {
        const newEditIndex = [...editIndex];
        const arrIndex = newEditIndex.indexOf(index);
        newEditIndex.splice(arrIndex, 1);
        setEditIndex(newEditIndex);
    }, [editIndex]);

    const OnSubmitClicked = useCallback((index, newItem) => {
        const newListItems = [...listItems];
        newListItems[index] = newItem;
        setListItems(newListItems);

        OnEditCancelClicked(index);
    }, [listItems]);

    const OnSubmitAndMoveNext = useCallback((index, newItem) => {
        OnSubmitClicked(index, newItem);

        for (let i = 0; i < editIndex.length; ++i)
        {
            if (editIndex[i] <= index) continue;
            listItemRefs.current[editIndex[i]].focus();
            break;
        }
    }, [listItems, editIndex]);

    return (
        <>
            <Box>
                <List>
                    <ListItemButton onClick={OnToggleOpen} sx={{ borderBottom: '1px solid #777' }}>
                        <ListItemText sx={{ color: "white" }} primary={<CollapsibleListTitle title={title} listItems={listItems} />} />
                        {open ? <ExpandLess htmlColor={"white"} /> : <ExpandMore htmlColor={"white"} />}
                    </ListItemButton>
                </List>
                <Collapse in={open}>
                    {
                        listItems &&
                        <Stack gap={1}>
                            {
                                listItems.map((li, index) => <CollapsibleListItem key={`${index}-${li}`} index={index} label={li}
                                    crudType={crudType}
                                    isEditing={editIndex.includes(index)}
                                    onEdit={() => OnEditClicked(index)}
                                    onEditCancel={() => OnEditCancelClicked(index)}
                                    onDelete={() => OnDeleteClicked(index)} 
                                    onSubmit={OnSubmitClicked}
                                    inputRefs={listItemRefs}
                                    onSubmitAndMoveNext={OnSubmitAndMoveNext} />
                                )
                            }
                        </Stack>
                    }
                </Collapse>
            </Box>
            {
                crudType !== DataCrudType.Read &&
                <Button variant={"contained"} size={"small"} startIcon={<Add />} sx={{ width: "fit-content" }} onClick={OnAddClicked}>
                    Add {title}
                </Button>
            }
        </>
    )
}

export function RecipeModalChild(props) {
	const { crudType } = props;

    const modalStates = React.useContext(ModalContext);

    const [recipeName, setRecipeName] = React.useState(modalStates.modalProps?.name ?? "");
    const [ingredients, setIngredients] = React.useState(modalStates.modalProps?.ingredients ?? []);
    const [steps, setSteps] = React.useState(modalStates.modalProps?.steps ?? []);

    React.useEffect(() => {
        modalStates.setModalProps({
            ...modalStates.modalProps,
            name: recipeName,
            ingredients: ingredients,
            steps: steps
        });
    }, [recipeName, ingredients, steps]);

    const OnNameChanged = useCallback((e) => {
        setRecipeName(e.target.value);
    }, []);
    
	return (
        <Stack gap={1} justifyContent={"space-between"}>
            <Box>
                {
                    crudType !== DataCrudType.Read &&
                    <Stack gap={1}>
                        <Typography color={"white"}>Name</Typography>
                        <TextField size={"small"} variant={"outlined"} value={recipeName} onChange={OnNameChanged} />
                    </Stack>
                }
                <Stack gap={1}>
                    <CollapsibleList title={"Ingredient"} listItems={ingredients} setListItems={setIngredients} crudType={crudType} />
                </Stack>
                <Stack gap={1}>
                    <CollapsibleList title={"Step"} listItems={steps} setListItems={setSteps} crudType={crudType} />
                </Stack>
            </Box>
        </Stack>
	)
}