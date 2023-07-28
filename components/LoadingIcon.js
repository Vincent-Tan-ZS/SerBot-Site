import {Box, LinearProgress, Stack, Typography, styled} from "@mui/material";

const LoadingAnimation = styled(Box)`
  width: 250px;
  height: 250px;
  animation-name: loading-keyframes;
  animation-duration: 0.5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease;
`;

export default function LoadingIcon(props)
{
	return(
		<Stack alignItems={'center'} spacing={1} {...props}>
			<LoadingAnimation />
			<Typography variant="h5" fontStyle={"italic"} color={"gray"}>
				Loading...
			</Typography>
			<LinearProgress sx={{width: '100%'}} />
		</Stack>
	)
}