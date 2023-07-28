import {Button, styled, Collapse} from "@mui/material";
import Link from "next/link";
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
	const { icon, label, path } = props;

	const [isHover, setIsHover] = React.useState(false);

	const OnMouseHover = () => {
		setIsHover(true);
	}

	const OnMouseLeave = () => {
		setIsHover(false);
	}

	return (
		<Link href={path} passHref>
			<StyledButton hov={isHover} onMouseEnter={OnMouseHover} onMouseLeave={OnMouseLeave} startIcon={icon}>
				<Collapse in={isHover} orientation={"horizontal"} sx={{whiteSpace: 'nowrap'}}>
					{label}
				</Collapse>
			</StyledButton>
		</Link>
	)
}

export default NavBarItem;