import { Typography } from "@mui/material"

export default function ConfirmationModalChild(props)
{
    const { message } = props;

    return (
        <Typography color={"white"}>{message}</Typography>
    )
}