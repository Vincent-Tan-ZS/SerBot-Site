import {Box} from "@mui/material";
import LoadingIcon from "./LoadingIcon";

export default function LoadingBox()
{
	return (
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
          <LoadingIcon />
        </Box>
	)
}