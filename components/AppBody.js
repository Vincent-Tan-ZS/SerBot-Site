import {Box, Toolbar} from "@mui/material";
import AppNavbar from "./AppBar/AppNavbar";
import MainContainer from "./MainContainer";

function AppBody(props) {
	const { children } = props;

	return (
		<>
			<AppNavbar />
			<Toolbar variant={"dense"} />
			<MainContainer>
				<Box sx={{height: '100%'}}>
					{children}
				</Box>
			</MainContainer>
		</>
	)
}

export default AppBody;