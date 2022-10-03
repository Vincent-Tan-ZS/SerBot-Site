import {Box, styled, Typography} from "@mui/material";
import Router from 'next/router';
import React from "react";

const StyledButton = styled(Box)(({ theme }) => `
	display: contents;

	padding-right: ${theme.spacing(1)};

	&.hover {
		cursor: pointer;
	}

	.MuiTypography-root {
		margin-top: 0;
		overflow: hidden;
		padding-left: ${theme.spacing(1)};

		transition: width 0.6s;
	}
`);

function NavBarItem(props) {
	const { startIcon, label, labelWidth, path } = props;

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
		<StyledButton className={isHover ? "hover" : ""} onMouseEnter={OnMouseHover} onMouseLeave={OnMouseLeave} onClick={OnBtnClicked}>
			<Box>
				{startIcon}
			</Box>
			<Typography width={isHover ? labelWidth : '0'}>
				{label}
			</Typography>
		</StyledButton>
	)
}

export default NavBarItem;