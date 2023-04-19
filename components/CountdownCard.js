
import React from "react";
import {Box, Card, CardActions, CardContent, CardMedia, IconButton, Stack, Tooltip, Typography, keyframes, styled} from "@mui/material";
import {Link as LinkIcon, Delete as DeleteIcon, BrokenImage as BrokenImageIcon, Edit as EditIcon} from '@mui/icons-material';
import {CopyToClipboard} from "../Utils";

const descLength = 300;
const cardMediaHeight = '140px';
const zoomInAnimation = keyframes`
	from: {
		opacity: 0,
		transform: scale3d(0.3, 0.3, 0.3)
	},
	'50%': {
		opacity: 1
	}
`;

const CountdownCardStyle = styled(Card)`
	box-shadow: 0px 0px 8px 4px #0E4686;
	background-color: #24252C;
	color: white;
	height: 500px;

	&.hide {
		opacity: 0%;
	}

	&.show {
		opacity: 100%;
	}

	animation: 0.2s ${zoomInAnimation} forwards;

	display: flex;
	flex-direction: column;
	justify-content: space-between;

	:hover {
		box-shadow: 0px 0px 8px 8px #3e6a9e;
	}

	.MuiCardMedia-root {
		height: ${cardMediaHeight};
		width: 100%;
	}

	.MuiCardActions-root {
		justify-content: space-between;
	}
`;

const CountdownImage = (props) => {
	let spanStyle = {
		display: 'block',
		padding: '4px',
		background: '#303436'
	};

	// if (props.src.length > 0)
	// {
	// 	spanStyle.background = `url(${props.src})`;
	// 	spanStyle.backgroundSize = '300px 100px';
	// 	spanStyle.backgroundPositionX = 'center';
	// 	spanStyle.backgroundPositionY = 'center';
	// }

	return (
		<span style={spanStyle}>
			{
				props.src?.length > 0 &&
				<CardMedia {...props} />
			}
			{
				props.src?.length <= 0 &&
				<Box height={cardMediaHeight} width={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
					<BrokenImageIcon sx={{fontSize: "5rem"}} />
					<Typography>No Image Added</Typography>
				</Box>
			}
		</span>
	)
}

export default function CountdownCard(props) {
	const { countdown, animationDelay, snackbarStates } = props;

	const [opacityClass, setOpacityClass] = React.useState("hide");

	const OnDeleteClicked = (cdName) => () => {
		CopyToClipboard(snackbarStates, `ser cd delete ${cdName}`);
	}

	const OnEditClicked = (cdName) => () => {
		CopyToClipboard(snackbarStates, `ser cd update ${cdName}`);
	}

	const OnLinkClicked = (cdLink) => () => {
		window.open(cdLink, "_blank");
	}

	const OnCardAnimationStart = (e) => {
		setOpacityClass("show");
	}

	return (
		<CountdownCardStyle sx={{animationDelay: animationDelay}} className={opacityClass} onAnimationStart={OnCardAnimationStart}>
			<Box>
				<CountdownImage component={"img"} src={countdown.Image} title={countdown.Name} />
				<CardContent>
					<Typography variant={"h6"} fontWeight={"bold"}>{countdown.Name}</Typography>
					<Typography fontStyle={"italic"}>{countdown.Date}</Typography>
					<Typography>{countdown.Description?.length > descLength ? `${countdown.Description.substring(0, descLength)}...` : countdown.Description}</Typography>
				</CardContent>
			</Box>
			<CardActions>
				<Stack direction={"row"} gap={1} justifyContent={"space-between"} width={"100%"}>
					<Box>
						<Tooltip title={"Copy update command"}>
							<IconButton color={"primary"} onClick={OnEditClicked(countdown.Name)}>
								<EditIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title={"Copy delete command"}>
							<IconButton color={"primary"} onClick={OnDeleteClicked(countdown.Name)}>
								<DeleteIcon />
							</IconButton>
						</Tooltip>
					</Box>
					{
						countdown.URL?.length > 0 &&
						<Tooltip title={"Visit Countdown URL"}>
							<IconButton color={"primary"} onClick={OnLinkClicked(countdown.URL)}>
								<LinkIcon />
							</IconButton>
						</Tooltip>
					}
				</Stack>
			</CardActions>
		</CountdownCardStyle>
	)
}