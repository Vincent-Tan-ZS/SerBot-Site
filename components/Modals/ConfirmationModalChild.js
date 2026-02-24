import { Button, Stack, Typography } from "@mui/material"
import { useCallback, useContext } from "react";
import { ModalContext } from "../../contexts/ModalContext";

export default function ConfirmationModalChild(props)
{
    const { callback, message } = props;

    const modalStates = useContext(ModalContext);

    const OnConfirm = useCallback(() => {
        modalStates.CloseModal();
        if (callback) callback();
    });

    const OnCancel = useCallback(() => {
        modalStates.CloseModal();
    });

    return (
        <Stack gap={2}>
            <Typography color={"white"}>{message}</Typography>
            <Stack direction={"row"} gap={2} alignSelf={"end"}>
                <Button variant="contained" color="primary" onClick={OnConfirm}>Confirm</Button>
                <Button variant="contained" color="error" onClick={OnCancel}>Cancel</Button>
            </Stack>
        </Stack>
    )
}