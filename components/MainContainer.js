import {Container, styled} from "@mui/material";

const MainContainer = styled(Container)(({ theme }) => `
	background-color: #191919;
	height: calc(100vh - 48px);

	padding: ${theme.spacing(1)};
`);

export default MainContainer;