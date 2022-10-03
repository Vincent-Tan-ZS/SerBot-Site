import {Home as HomeIcon, ViewList as ViewListIcon} from "@mui/icons-material";
import {AppBar, styled, Toolbar} from "@mui/material";
import NavBarItem from "./NavBarItem";

const NavBar = styled(AppBar)(({ theme }) => `
	background-color: #0e4686;
`);

function AppNavbar() {
	return (
		<NavBar>
			<Toolbar variant={"dense"}>
				<NavBarItem startIcon={<HomeIcon />} label={"Home"} labelWidth={'3%'} path={"/"} />
				<NavBarItem startIcon={<ViewListIcon />} label={"Commands"} labelWidth={'6%'} path={"/commands"}/>	
			</Toolbar>
		</NavBar>
	)
}

export default AppNavbar;