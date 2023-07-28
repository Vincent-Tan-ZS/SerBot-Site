import {ViewList as ViewListIcon, HourglassBottom as HourglassBottomIcon, LibraryMusic as LibraryMusicIcon} from "@mui/icons-material";
import {AppBar, Box, styled, Toolbar, Typography} from "@mui/material";
import NavBarItem from "./NavBarItem";
import IconImage from "../IconImg";
import React from "react";
import Link from "next/link";

const NavBar = styled(AppBar)`
	background-color: #0e4686;
`;

const IconBox = styled(Box)`
	position: fixed;
	top: -10%;
	transition: top 0.5s;

	:hover {
		top: -1%;
	}
`;

function AppNavbar() {
	const [mouseEnterIcon, setMouseEnterIcon] = React.useState(false);

	const OnHoverIcon = () => {
		setMouseEnterIcon(true);
	}

	const OnLeaveIcon = () => {
		setMouseEnterIcon(false);
	}

	return (
		<NavBar>
			<Toolbar variant={"dense"}>
				<Link href={"/"} passHref>
					<IconBox onMouseEnter={OnHoverIcon} onMouseLeave={OnLeaveIcon}>
						<IconImage title={"Home Page"} />
						<Typography sx={{opacity: mouseEnterIcon === true ? '100%' : '0%', transition: 'opacity 0.5s'}} textAlign={'center'} fontStyle={'italic'} color={'gray'}>
							Credit: PhoenixFirebirb
						</Typography>
					</IconBox>
				</Link>
				<Box width={'150px'}></Box>
				<NavBarItem icon={<ViewListIcon />} label={"Commands"} path={"/commands"}/>
				<NavBarItem icon={<HourglassBottomIcon />} label={"Countdowns"} path={"/countdowns"}/>	
				<NavBarItem icon={<LibraryMusicIcon />} label={"Song Lists"} path={"/songlists"}/>	
			</Toolbar>
		</NavBar>
	)
}

export default AppNavbar;