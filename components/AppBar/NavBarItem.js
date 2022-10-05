import {Button, styled, Collapse} from "@mui/material";
import Router from 'next/router';
import React from "react";

const StyledButton = styled(Button, {shouldForwardProp: prop => prop !== "hov"})(({ theme, hov }) => `
	color: white;
	align-items: flex-end;

	&.MuiButton-root {
		${
			hov === true && 
			`background-color: #191919;
			 border: 1px solid black;
			 border-radius: ${theme.spacing(0.5)}`
		}
	}
`);

function NavBarItem(props) {
	const { startIcon, label, path } = props;

	const [isHover, setIsHover] = React.useState(false);

	const OnMouseHover = () => {
		setIsHover(true);
	}

	const OnMouseLeave = () => {
		setIsHover(false);
	}

	const OnBtnClicked = () => {
		Router.push(path);
	}

	return (
		<StyledButton hov={isHover} onMouseEnter={OnMouseHover} onMouseLeave={OnMouseLeave} onClick={OnBtnClicked} startIcon={startIcon}>
			<Collapse in={isHover} orientation={"horizontal"}>
				{label}
			</Collapse>
		</StyledButton>
	)
}

export default NavBarItem;