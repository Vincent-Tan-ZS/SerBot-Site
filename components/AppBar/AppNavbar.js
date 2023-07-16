import {Home as HomeIcon, ViewList as ViewListIcon, HourglassBottom as HourglassBottomIcon, LibraryMusic as LibraryMusicIcon} from "@mui/icons-material";
import {AppBar, styled, Toolbar} from "@mui/material";
import NavBarItem from "./NavBarItem";

const NavBar = styled(AppBar)`
	background-color: #0e4686;
`;

function AppNavbar() {
	return (
		<NavBar>
			<Toolbar variant={"dense"}>
				<NavBarItem startIcon={<HomeIcon />} label={"Home"} path={"/"} />
				<NavBarItem startIcon={<ViewListIcon />} label={"Commands"} path={"/commands"}/>	
				<NavBarItem startIcon={<HourglassBottomIcon />} label={"Countdowns"} path={"/countdowns"}/>	
				<NavBarItem startIcon={<LibraryMusicIcon />} label={"Song Lists"} path={"/songlists"}/>	
			</Toolbar>
		</NavBar>
	)
}

export default AppNavbar;