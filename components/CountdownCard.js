
import React from "react";
import {Box, Card, CardActions, CardContent, CardMedia, IconButton, Stack, Tooltip, Typography, keyframes, styled} from "@mui/material";
import {Link as LinkIcon, Delete as DeleteIcon, BrokenImage as BrokenImageIcon, Edit as EditIcon, Add as AddIcon} from '@mui/icons-material';
import {COUNTDOWN_CARD_TYPE_ADD, COUNTDOWN_CARD_TYPE_COUNTDOWN, CopyToClipboard} from "../Utils";
import { zoomIn } from "react-animations";
import {SnackbarContext} from "../contexts/SnackbarContext";
import {ModalContext} from "../contexts/ModalContext";
import AddCountdownModalContent from "./Modals/AddCountdownModalContent";

const descLength = 300;
const cardMediaHeight = '140px';
const zoomInAnimation = keyframes`${zoomIn}`;

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

	&.clickable {
		cursor: pointer;
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

const AddCardContent = styled(CardContent)(({ theme }) => `
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	.MuiSvgIcon-root {
		font-size: 4rem;
		transition: font-size 0.2s;
		color: ${theme.palette.primary.main};
	}

	:hover {
		.MuiSvgIcon-root {
			font-size: 5rem;
			color: ${theme.palette.primary.light};
		}
	}
`)

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
	const { countdown, animationDelay, name } = props;
	const snackbarStates = React.useContext(SnackbarContext);
	const modalStates = React.useContext(ModalContext);

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

	const OnCardClicked = (cardType) => () => {
		if (cardType !== COUNTDOWN_CARD_TYPE_ADD) return;

		modalStates.setModalOpen(true);
		modalStates.setModalTitle("Add Countdown");
		modalStates.setModalChildren(<AddCountdownModalContent name={name} />);
	}

	return (
		<CountdownCardStyle sx={{animationDelay: animationDelay}} className={`${opacityClass} ${countdown.CardType === COUNTDOWN_CARD_TYPE_ADD && "clickable"}`} onAnimationStart={OnCardAnimationStart} onClick={OnCardClicked(countdown.CardType)}>
			<Box sx={{height: '100%'}}>
				{
					countdown.CardType === COUNTDOWN_CARD_TYPE_COUNTDOWN &&
					<>
						<CountdownImage component={"img"} src={countdown.Image} title={countdown.Name} />
						<CardContent>
							<Typography variant={"h6"} fontWeight={"bold"}>{countdown.Name}</Typography>
							<Typography fontStyle={"italic"}>{countdown.Date}</Typography>
							<Typography>{countdown.Description?.length > descLength ? `${countdown.Description.substring(0, descLength)}...` : countdown.Description}</Typography>
						</CardContent>
					</>
				}
				{
					countdown.CardType === COUNTDOWN_CARD_TYPE_ADD &&
					<AddCardContent>
						<AddIcon />
					</AddCardContent>
				}
			</Box>
			{
				countdown.CardType === COUNTDOWN_CARD_TYPE_COUNTDOWN &&
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
		</CountdownCardStyle>
	)
}