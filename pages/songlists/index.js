import {Accordion, AccordionDetails, AccordionSummary, Button, IconButton, List, ListItem, Stack, Typography, styled} from "@mui/material";
import AppBody from "../../components/AppBody";
import React from "react";
import {ExpandMore, MusicVideo, PlaylistAdd, QueuePlayNext} from "@mui/icons-material";
import {ModalContext} from "../../contexts/ModalContext";
import AuthCodeModalChild from "../../components/Modals/AuthCodeModalChild";
import SongListModalChild from "../../components/Modals/SongListModalChild";
import {CheckAuthCode, GetYTEmbed, IsValidURL} from "../../Utils";
import useSWR from "swr";
import MediaPopover from "../../components/MediaPopover";
import ImportSongsModalChild from "../../components/Modals/ImportSongsModalChild";
import LoadingBox from "../../components/LoadingBox";

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
									{sL.id}. {sL.song}
									{
										IsValidURL(sL.song) &&
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
	const [nextModal, setNextModal] = React.useState("");

	const [popoverAnchor, setPopoverAnchor] = React.useState(null);
	const [popoverLink, setPopoverLink] = React.useState("");

	const OpenSongList = () => {
		const userId = sessionStorage.getItem("DiscordUserId");

		modalStates.setModalTitle("Song List");
		modalStates.setModalHeight("500px");
		modalStates.setModalChildren(<SongListModalChild list={data?.find(d => d.UserId === userId)?.SongList} refresh={mutate} />);
	}

	const OpenImportPlaylist = () => {
		modalStates.setModalTitle("Import Playlist");
		modalStates.setModalHeight("300px");
		modalStates.setModalChildren(<ImportSongsModalChild refresh={mutate} />);
	}

	const OpenUserAuth = () => {
		modalStates.setModalTitle("User Confirmation");
        modalStates.setModalHeight("auto");
		modalStates.setModalChildren(<AuthCodeModalChild refresh={mutate} setAuthed={setAuthed} />);
	}

	React.useEffect(() => {
		if (authed !== true) return;

		switch (nextModal)
		{
			case "SongList":
				OpenSongList();
				break;
			case "ImportPlaylist":
				OpenImportPlaylist();
				break;
		}

		setAuthed(false);
	}, [data, authed]);

	const OnAddUpdateSongListClicked = () => {
		CheckAuthCode();
		setNextModal("SongList");

		modalStates.setModalOpen(true);

		const userId = sessionStorage.getItem("DiscordUserId");

		if (userId?.length > 0)
		{
			OpenSongList();
		}
		else
		{
			OpenUserAuth();
		}
	}

	const OnImportClicked = async () => {
		CheckAuthCode();
		setNextModal("ImportPlaylist")

		modalStates.setModalOpen(true);

		const userId = sessionStorage.getItem("DiscordUserId");

		if (userId?.length > 0)
		{
			OpenImportPlaylist();
		}
		else
		{
			OpenUserAuth();
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
				{
					isValidating === true &&
					<LoadingBox />
				}
				{
					isValidating !== true &&
					<Stack spacing={1} height='100%'>
						<Stack direction={"row"} spacing={1} paddingTop={1} paddingBottom={1}>
							<Button variant={"contained"} onClick={OnAddUpdateSongListClicked}>
								<PlaylistAdd fontSize="small" />&nbsp;Add / Update my list
							</Button>
							<Button variant={"contained"} onClick={OnImportClicked}>
								<QueuePlayNext fontSize="small" />&nbsp;Import Playlist
							</Button>
						</Stack>
						<AccordionStack spacing={1}>
							{
								data !== undefined &&
								data.map((d) => {
									return (
										<>
											{
												d.SongList.length > 0 &&
												<UserSongsAccordion key={`user-song-accordion-${d.UserName}`} username={d.UserName} songList={d.SongList} OnMusicVideoClicked={OnMusicVideoClicked} />
											}
										</>
									)
								})
							}
						</AccordionStack>
					</Stack>
				}
			</AppBody>
			<MediaPopover anchor={popoverAnchor} onClose={OnPopoverClose} link={popoverLink} />
		</>
	)
}

export default SongLists;