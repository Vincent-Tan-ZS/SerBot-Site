import {Toolbar} from "@mui/material";
import AppNavbar from "./AppBar/AppNavbar";
import MainContainer from "./MainContainer";

function AppBody(props) {
	const { children } = props;

	return (
		<>
			<AppNavbar />
			<Toolbar variant={"dense"} />
			<MainContainer>
				{children}
			</MainContainer>
		</>
	)
}

export default AppBody;