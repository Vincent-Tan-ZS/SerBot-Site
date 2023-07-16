import {Accordion, AccordionDetails, AccordionSummary, Button, IconButton, List, ListItem, Stack, Typography, styled} from "@mui/material";
import AppBody from "../../components/AppBody";
import React from "react";
import {ExpandMore, MusicNote, MusicVideo} from "@mui/icons-material";
import {ModalContext} from "../../contexts/ModalContext";
import AuthCodeModalChild from "../../components/Modals/AuthCodeModalChild";
import SongListModalChild from "../../components/Modals/SongListModalChild";
import {CheckAuthCode, GetYTEmbed} from "../../Utils";
import useSWR from "swr";
import MediaPopover from "../../components/MediaPopover";

const UserSongsAccordionStyle = styled(Accordion)`
	.MuiAccordionSummary-root {
		background: #303436;
		color: white;
	}

	.MuiAccordionSummary-expandIconWrapper {
		.MuiSvgIcon-root {
			color: white;
		}
	}

	.MuiAccordionDetails-root {
		background: #24252C;
		color: white;
		padding: 8px;
		max-height: 200px;
		overflow-y: auto;
	}
`;

const AccordionStack = styled(Stack)`
	height: 100%;
	overflow-y: auto;
`;

const UserSongsAccordion = (props) => {
	const { username, songList, OnMusicVideoClicked } = props;
	
	return (
		<UserSongsAccordionStyle>
			<AccordionSummary id={`${username}-songs`} expandIcon={<ExpandMore />}>
				<Typography>
					{username}&apos;s Song List
				</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<List disablePadding>
					{
						songList.map((sL) => {
							return (
								<ListItem key={`accordion-list-item-${sL.id}`}>
									{sL.song}
									{
										(sL.song.startsWith("http") || sL.song.startsWith("www")) &&
										<>
											&nbsp;
											<IconButton onClick={OnMusicVideoClicked(sL.song)}>
												<MusicVideo htmlColor={"white"} />
											</IconButton>
										</>
									}
								</ListItem>
							)
						})
					}
				</List>
			</AccordionDetails>
		</UserSongsAccordionStyle>
	)
}

const fetcher = (...args) => fetch(...args).then(res => res.json());

function SongLists(props)
{
	const { data, isValidating, mutate } = useSWR("/api/songLists", fetcher);

	const modalStates = React.useContext(ModalContext);

	const [authed, setAuthed] = React.useState(false);

	const [popoverAnchor, setPopoverAnchor] = React.useState(null);
	const [popoverLink, setPopoverLink] = React.useState("");

	React.useEffect(() => {
		if (authed !== true) return;
		
		const userId = sessionStorage.getItem("DiscordUserId");

		modalStates.setModalTitle("Song List");
		modalStates.setModalHeight("500px");
		modalStates.setModalChildren(<SongListModalChild list={data?.find(d => d.UserId === userId)?.SongList} refresh={mutate} />);
		setAuthed(false);
	}, [data, authed]);

	const OnButtonClicked = () => () => {
		CheckAuthCode();

		modalStates.setModalOpen(true);

		const userId = sessionStorage.getItem("DiscordUserId");

		if (userId?.length > 0)
		{
			modalStates.setModalTitle("Song List");
			modalStates.setModalHeight("500px");
			modalStates.setModalChildren(<SongListModalChild list={data?.find(d => d.UserId === userId)?.SongList} refresh={mutate} />);
		}
		else
		{
			modalStates.setModalTitle("User Confirmation");
			modalStates.setModalChildren(<AuthCodeModalChild refresh={mutate} setAuthed={setAuthed} />);
		}
	}
	
	const OnMusicVideoClicked = (song) => (e) => {
		setPopoverAnchor(e.currentTarget);
		setPopoverLink(GetYTEmbed(song));
	}

	const OnPopoverClose = () => {
		setPopoverAnchor(null);
		setPopoverLink("");
	}

	return (
		<>
			<AppBody>
				<Stack spacing={1} height='100%'>
					<Stack direction={"row"} spacing={1} paddingTop={1} paddingBottom={1}>
						<Button variant={"contained"} onClick={OnButtonClicked()}>
							<MusicNote fontSize="small" />&nbsp;Add / Update my list
						</Button>
					</Stack>
					<AccordionStack spacing={1}>
						{
							data !== undefined &&
							data.map((d) => {
								return (
									<UserSongsAccordion key={`user-song-accordion-${d.UserName}`} username={d.UserName} songList={d.SongList} OnMusicVideoClicked={OnMusicVideoClicked} />
								)
							})
						}
					</AccordionStack>
				</Stack>
			</AppBody>
			<MediaPopover anchor={popoverAnchor} onClose={OnPopoverClose} link={popoverLink} />
		</>
	)
}

export default SongLists;