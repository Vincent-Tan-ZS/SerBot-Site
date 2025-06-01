import {ViewList as ViewListIcon, HourglassBottom as HourglassBottomIcon, LibraryMusic as LibraryMusicIcon, Home as HomeIcon, OutdoorGrill as OutdoorGrillIcon, Leaderboard} from "@mui/icons-material";
import {AppBar, Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, Toolbar, Typography} from "@mui/material";
import NavBarItem from "./NavBarItem";
import IconImage from "../IconImg";
import React from "react";
import Link from "next/link";
import {MobileContext} from "../../contexts/MobileContext";

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

const MobileLink = styled(Link)`
	.MuiSvgIcon-root {
		color: white;
	}
`;

const Links = [
	{ icon: <HomeIcon />, label: "Home", path: "/" },
	{ icon: <ViewListIcon />, label: "Commands", path: "/commands" },
	{ icon: <HourglassBottomIcon />, label: "Countdowns", path: "/countdowns" },
	{ icon: <LibraryMusicIcon />, label: "Song Lists", path: "/songlists" },
	{ icon: <OutdoorGrillIcon />, label: "Meal Recipes", path: "/recipes" },
	{ icon: <Leaderboard />, label: "Leaderboards", path: "/leaderboard" }
];

function AppNavbar() {
	const isMobile = React.useContext(MobileContext);

	const [mouseEnterIcon, setMouseEnterIcon] = React.useState(false);
	const [openNavDrawer, setOpenNavDrawer] = React.useState(false);

	const OnMouseHover = (toggle) => () => {
		setMouseEnterIcon(toggle);
	}

	const OnIconMenuClicked = () => {
		setOpenNavDrawer(!openNavDrawer);
	}

	const OnCloseIconMenu = () => {
		setOpenNavDrawer(false);
	}

	return (
		<NavBar>
			<Toolbar variant={"dense"}>
				{
					isMobile === true &&
					<>
						<IconButton onClick={OnIconMenuClicked}>
							<IconImage width={'40px'} height={'40px'} />
						</IconButton>
						<Typography sx={{opacity: openNavDrawer === true ? '100%' : '0%', transition: 'opacity 0.5s'}} fontStyle={"italic"}>
							SerBot
						</Typography>
						<Drawer sx={{zIndex: 1009}} open={openNavDrawer} onClose={OnCloseIconMenu} anchor={"top"}>
							<Box sx={{background: '#09315d'}} color={'white'} pt={'50px'}>
								<List>
									{
										Links.map((l) => {
											return (
												<>
													<MobileLink key={`mobile-nav-bar-${l.label}`} href={l.path} passHref>
														<ListItem>
															<ListItemIcon>
																{l.icon}
															</ListItemIcon>
															<ListItemText>
																{l.label}
															</ListItemText>
														</ListItem>
													</MobileLink>
													<Divider />
												</>
											)
										})
									}
								</List>
							</Box>
						</Drawer>
					</>
				}
				{
					isMobile !== true &&
					<>
						<Link href={"/"} passHref>
							<IconBox onMouseEnter={OnMouseHover(true)} onMouseLeave={OnMouseHover(false)}>
								<IconImage title={"Home Page"} />
								<Typography sx={{opacity: mouseEnterIcon === true ? '100%' : '0%', transition: 'opacity 0.5s'}} textAlign={'center'} fontStyle={'italic'} color={'gray'}>
									Credit: PhoenixFirebirb
								</Typography>
							</IconBox>
						</Link>
						<Box width={'150px'}></Box>
						{
							Links.slice(1).map((l) => {
								return (
									<NavBarItem key={`nav-bar-link-${l.label}`} icon={l.icon} label={l.label} path={l.path} />
								)
							})
						}
					</>
				}
			</Toolbar>
		</NavBar>
	)
}

export default AppNavbar;