import {Box, CircularProgress, styled} from "@mui/material";

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
		<>
			<CircularProgress size={350} thickness={2} sx={{ position: 'absolute' }} />
			<LoadingAnimation />
		</>
	)
}