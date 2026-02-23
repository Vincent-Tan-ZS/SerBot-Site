import {Container, styled} from "@mui/material";

const MainContainer = styled(Container)(({ theme }) => `
	background:
    radial-gradient(
      1200px 600px at 20% -10%,
      #1b2a3a 0%,
      transparent 60%
    ),
    radial-gradient(
      800px 400px at 90% 10%,
      #162232 0%,
      transparent 55%
    ),
    linear-gradient(
      180deg,
      #17395d 0%,
      #192736 100%
    );
	height: calc(100vh - 48px);
  border-style: none solid none solid;
  border-width: 4px;
  border-image: linear-gradient(180deg, #00739E 0%, transparent 100%);
  border-image-slice: 1;

	padding: ${theme.spacing(1)};
`);

export default MainContainer;