import {Accordion, AccordionDetails, AccordionSummary, Button, IconButton, List, ListItem, Stack, Typography, styled} from "@mui/material";
import AppBody from "../../components/AppBody";
import React from "react";
import {ExpandMore, MusicVideo, PlaylistAdd, QueuePlayNext} from "@mui/icons-material";
import {ModalContext} from "../../contexts/ModalContext";
import SongListModalChild from "../../components/Modals/SongListModalChild";
import {ApiFetcher, ExecuteAuthAction, GetYTEmbed, IsValidURL} from "../../Utils";
import useSWR from "swr";
import MediaPopover from "../../components/MediaPopover";
import ImportSongsModalChild from "../../components/Modals/ImportSongsModalChild";
import LoadingBox from "../../components/LoadingBox";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";

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

function SongLists(props)
{
	const { data, isValidating, mutate } = useSWR("/api/songLists", ApiFetcher);

	const modalStates = React.useContext(ModalContext);

	const [popoverAnchor, setPopoverAnchor] = React.useState(null);
	const [popoverLink, setPopoverLink] = React.useState("");

	const OpenSongList = () => {
		const userId = sessionStorage.getItem("DiscordUserId");

		modalStates.OpenModal({
			title: "Song List",
			height: "500px",
			children: <SongListModalChild list={data?.find(d => d.UserId === userId)?.SongList} refresh={mutate} />
		});
	}

	const OpenImportPlaylist = () => {
		modalStates.OpenModal({
			title: "Import Playlist",
			height: "300px",
			children: <ImportSongsModalChild refresh={mutate} />
		});
	}

	const OnAddUpdateSongListClicked = () => {
		ExecuteAuthAction(() => {
			OpenSongList();
		}, modalStates, mutate);
	}

	const OnImportClicked = async () => {
		ExecuteAuthAction(() => {
			OpenImportPlaylist();
		}, modalStates, mutate);
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