import {Box, Button, IconButton, Popover, Table, TableBody, TableCell, TableHead, TableRow, TextField, styled} from "@mui/material";
import AppTableContainer from "../AppTableContainer";
import React from "react";
import axios from "axios";
import {MusicVideo} from "@mui/icons-material";
import {GetYTEmbed, IsValidURL, SNACKBAR_SEVERITY_ERROR, SetSnackbarOpen, SetSnackbarSeverity, SetSnackbarText} from "../../Utils";
import MediaPopover from "../MediaPopover";
import {SnackbarContext} from "../../contexts/SnackbarContext";

export default function SongListModalChild(props) {
	const { refresh } = props;
	let { list } = props;

	const snackbarStates = React.useContext(SnackbarContext);

	const [newSong, setNewSong] = React.useState("");
	const [songList, setSongList] = React.useState(list);

	const [popoverAnchor, setPopoverAnchor] = React.useState(null);
	const [popoverLink, setPopoverLink] = React.useState("");

	const userId = sessionStorage.getItem("DiscordUserId");
	const userName = sessionStorage.getItem("DiscordUserName");

	const OnNewSongChanged = (e) => {
		setNewSong(e.target.value);
	}

	const OnMusicVideoClicked = (song) => (e) => {
		setPopoverAnchor(e.currentTarget);
		setPopoverLink(GetYTEmbed(song));
	}

	const OnPopoverClose = () => {
		setPopoverAnchor(null);
		setPopoverLink("");
	}

	const OnAddSongClicked = () => {
		axios.post(`./api/addNewSong`, {
			userId: userId,
			username: userName,
			song: newSong
		}).then((res) => {
			refresh();

			let _list = [...songList];

			_list.push({
				id: list.length + 1,
				song: newSong
			});

			setSongList(_list);

			setNewSong("");
		}).catch((err) => {
			SetSnackbarOpen(snackbarStates, true);
			SetSnackbarSeverity(snackbarStates, SNACKBAR_SEVERITY_ERROR);
			SetSnackbarText(snackbarStates, err.response.data.message);
		});
	}

	const OnDeleteSongClicked = (songId) => () => {
		axios.post(`./api/deleteSong`, {
			userId: userId,
			songId: songId
		}).then((res) => {
			refresh();

			let index = songList.findIndex(s => s.id === songId);

			if (index >= 0)
			{
				let _songList = [...songList];
				_songList.splice(index, 1);

				setSongList(_songList);
			}
		}).catch((err) => {
			SetSnackbarOpen(snackbarStates, true);
			SetSnackbarSeverity(snackbarStates, SNACKBAR_SEVERITY_ERROR);
			SetSnackbarText(snackbarStates, err.response.data.message);
		});
	}

	return (
		<>
			<AppTableContainer>
				<Table stickyHeader>
					<colgroup>
						<col width={"90%"} />
						<col width={"10%"} />
					</colgroup>
					<TableHead>
						<TableRow>
							<TableCell>Song Name / Youtube URL</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{
							songList !== undefined &&
							songList.map((l) => {
								return (
									<TableRow key={`song-list-row-${l.id}-${l.song}`}>
										<TableCell>
											{l.song}
											{
												IsValidURL(l.song) &&
												<>
													&nbsp;
													<IconButton onClick={OnMusicVideoClicked(l.song)}>
														<MusicVideo />
													</IconButton>
												</>
											}
										</TableCell>
										<TableCell>
											<Button variant="contained" onClick={OnDeleteSongClicked(l.id)}>Delete</Button>
										</TableCell>
									</TableRow>
								)
							})
						}
						<TableRow>
							<TableCell>
								<TextField size="small" fullWidth value={newSong} onChange={OnNewSongChanged} />
							</TableCell>
							<TableCell>
								<Button variant="contained" onClick={OnAddSongClicked}>Add</Button>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</AppTableContainer>
			<MediaPopover anchor={popoverAnchor} onClose={OnPopoverClose} link={popoverLink} />
		</>
	)
}