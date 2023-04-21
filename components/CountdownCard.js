
import React from "react";
import {Box, Card, CardActions, CardContent, CardMedia, IconButton, Stack, Tooltip, Typography, css, keyframes, styled} from "@mui/material";
import {Link as LinkIcon, Delete as DeleteIcon, BrokenImage as BrokenImageIcon, Edit as EditIcon} from '@mui/icons-material';
import {CopyToClipboard} from "../Utils";
import { zoomIn } from "react-animations";
import {SnackbarContext} from "../contexts/SnackbarContext";
import {MobileContext} from "../contexts/MobileContext";
import {ModalContext} from "../contexts/ModalContext";
import MobileCardClickedModalChild from "./Modals/MobileCardClickedModalChild";

const descLength = 300;
const cardMediaHeight = '140px';
const zoomInAnimation = keyframes`${zoomIn}`;

const BaseCardStyle = css`
	box-shadow: 0px 0px 8px 4px #0E4686;
	background-color: #24252C;
	color: white;

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
`;

const CountdownCardStyle = styled(Card) `
	${BaseCardStyle}
	height: 500px;

	.CardTopBody-root {
		height: 100%;
	}

	.CountdownImage-root {
		display: block;
		padding: 4px;
		background: #303436
	}

	.MuiCardMedia-root {
		height: ${cardMediaHeight};
		width: 100%;
	}

	.MuiCardActions-root {
		justify-content: space-between;
	}
`;

const MobileCountdownCardStyle = styled(Card) `
	${BaseCardStyle}
	height: 100px;

	.CardTopBody-root {
		display: flex;
	}

	.CountdownImage-root {
		display: flex;
		height: 100%;
		width: 30%;
	}

	.MuiCardContent-root {
		width: 70%;
	}
`;

const VariedCountdownCard = (props) => {
	const isMobile = React.useContext(MobileContext);

	return (
		<>
			{
				isMobile === true &&
				<MobileCountdownCardStyle {...props} />
			}
			{
				isMobile !== true &&
				<CountdownCardStyle {...props} />
			}
		</>
	)
}

const CountdownImage = (props) => {
	return (
		<span className="CountdownImage-root">
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
	const { countdown, animationDelay } = props;
	const snackbarStates = React.useContext(SnackbarContext);
	const modalStates = React.useContext(ModalContext);
	const isMobile = React.useContext(MobileContext);

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

	const OnCardClicked = () => {
		if (isMobile !== true) return;

		modalStates.setModalOpen(true);
		modalStates.setModalChildren(<MobileCardClickedModalChild name={countdown.Name} link={countdown.URL} />);
	}

	return (
		<VariedCountdownCard sx={{animationDelay: animationDelay}} className={opacityClass} onAnimationStart={OnCardAnimationStart} onClick={OnCardClicked}>
			<Box className={"CardTopBody-root"}>
				<CountdownImage component={"img"} src={countdown.Image} title={countdown.Name} />
				<CardContent>
					<Typography variant={"h6"} fontWeight={"bold"}>{countdown.Name}</Typography>
					<Typography fontStyle={"italic"}>{countdown.Date}</Typography>
					<Typography>{countdown.Description?.length > descLength ? `${countdown.Description.substring(0, descLength)}...` : countdown.Description}</Typography>
				</CardContent>
			</Box>
			{
				isMobile !== true &&
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
			}
		</VariedCountdownCard>
	)
}