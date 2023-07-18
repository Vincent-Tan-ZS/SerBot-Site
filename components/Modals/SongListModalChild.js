import {Box, Button, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography} from "@mui/material";
import AppTableContainer from "../AppTableContainer";
import React from "react";
import axios from "axios";
import {Add, Check, Close, Delete, DeleteForever, Edit, MusicVideo} from "@mui/icons-material";
import {GetYTEmbed, IsValidURL, SetErrorSnackbar} from "../../Utils";
import MediaPopover from "../MediaPopover";
import {SnackbarContext} from "../../contexts/SnackbarContext";
import BaseModal from "../BaseModal";

export default function SongListModalChild(props) {
	const { refresh } = props;
	let { list } = props;

	const snackbarStates = React.useContext(SnackbarContext);

	const [newSong, setNewSong] = React.useState("");
	const [songList, setSongList] = React.useState(list);

	const [updateSongId, setUpdateSongId] = React.useState(-1);
	const [updateSong, setUpdateSong] = React.useState("");
	const [updatePlaceholder, setUpdatePlaceholder] = React.useState("");

	const [popoverAnchor, setPopoverAnchor] = React.useState(null);
	const [popoverLink, setPopoverLink] = React.useState("");

	const [deleteAllModalOpen, setDeleteAllModalOpen] = React.useState(false);

	const userId = sessionStorage.getItem("DiscordUserId");
	const userName = sessionStorage.getItem("DiscordUserName");

	const OnNewSongChanged = (e) => {
		setNewSong(e.target.value);
	}

	const OnUpdateSongChanged = (e) => {
		setUpdateSong(e.target.value);
	}

	const OnSongKeyDown = (e) => {
		if (e.code === "Enter")
		{
			OnAddSongClicked();
		}
	}

	const OnUpdateSongKeyDown = (e) => {
		if (e.code == "Enter")
		{
			OnUpdateSong();
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

	const OnAddSongClicked = () => {
		if (newSong.length <= 0)
		{
			SetErrorSnackbar(snackbarStates, "Song Name / URL cannot be empty!");
			return;
		}

		axios.post(`./api/addNewSong`, {
			userId: userId,
			username: userName,
			song: newSong
		}).then((res) => {
			refresh();

			let _list = songList === undefined ? [] : [...songList];

			_list.push({
				id: _list.length + 1,
				song: newSong
			});

			setSongList(_list);

			setNewSong("");
		}).catch((err) => {
			SetErrorSnackbar(snackbarStates, err.response.data.message);
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
			SetErrorSnackbar(snackbarStates, err.response.data.message);
		});
	}
	
	const OnDeleteAllClicked = () => {
		setDeleteAllModalOpen(true);
	}

	const OnDeleteAllModalClosed = () => {
		setDeleteAllModalOpen(false);
	}

	const OnDeleteAllConfirmed = () => {
		axios.post(`./api/deleteAllSongs`, {
			userId: userId
		}).then((res) => {
			refresh();	
			setSongList([]);
		}).catch((err) => {
			SetErrorSnackbar(snackbarStates, err.response.data.message);
		}).finally(() => {
			OnCancelUpdateSong();
		});

		OnDeleteAllModalClosed();
	}

	const OnUpdateClicked = (songId) => (e) => {
		const songName = songList.find((s) => Number(s.id) === Number(songId)).song;

		setUpdateSongId(songId);
		setUpdateSong(songName);
		setUpdatePlaceholder(songName);
	}

	const OnUpdateSong = () => {
		if (updateSong.length <= 0)
		{
			SetErrorSnackbar(snackbarStates, "Song Name / URL cannot be empty!");
			return;
		}

		axios.post(`./api/updateSong`, {
			userId: userId,
			songId: updateSongId,
			newSong: updateSong
		}).then((res) => {
			refresh();

			let _list = songList === undefined ? [] : [...songList];
			let _index = _list.findIndex((s) => Number(s.id) === Number(updateSongId));

			_list[_index].song = updateSong;

			setSongList(_list);
		}).catch((err) => {
			SetErrorSnackbar(snackbarStates, err.response.data.message);
		}).finally(() => {
			OnCancelUpdateSong();
		});
	}

	const OnCancelUpdateSong = () => {
		setUpdateSong("");
		setUpdatePlaceholder("");
		setUpdateSongId(-1);
	}

	return (
		<>
			<Box display={"flex"} justifyContent={"flex-end"} pb={2}>
				<Button variant={"contained"} onClick={OnDeleteAllClicked} disabled={songList === undefined || songList?.length <= 0}>
					<DeleteForever fontSize="small" />&nbsp;
					Delete All
				</Button>
			</Box>
			<AppTableContainer>
				<Table stickyHeader>
					<colgroup>
						<col width={"85%"} />
						<col width={"15%"} />
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
											{
												updateSongId === l.id &&
												<TextField size="small" autoFocus fullWidth value={updateSong} placeholder={updatePlaceholder} onChange={OnUpdateSongChanged} onKeyDown={OnUpdateSongKeyDown}  />
											}
											{
												updateSongId !== l.id &&
												<>
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
												</>
											}
											
										</TableCell>
										<TableCell>
											{
												updateSongId === l.id &&
												<Stack direction={"row"} spacing={1}>
													<Button variant="contained" onClick={OnUpdateSong} color={"success"}>
														<Check />
													</Button>
													<Button variant="contained" onClick={OnCancelUpdateSong} color={"error"}>
														<Close />
													</Button>
												</Stack>
											}
											{
												updateSongId !== l.id &&
												<Stack direction={"row"} spacing={1}>
													<Button variant="contained" onClick={OnDeleteSongClicked(l.id)}>
														<Delete />
													</Button>
													<Button variant="contained" onClick={OnUpdateClicked(l.id)}>
														<Edit />
													</Button>
												</Stack>
											}
										</TableCell>
									</TableRow>
								)
							})
						}
						<TableRow>
							<TableCell>
								<TextField size="small" fullWidth value={newSong} onChange={OnNewSongChanged} onKeyDown={OnSongKeyDown} />
							</TableCell>
							<TableCell>
								<Button variant="contained" onClick={OnAddSongClicked}>
									<Add />
								</Button>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</AppTableContainer>
			<MediaPopover anchor={popoverAnchor} onClose={OnPopoverClose} link={popoverLink} />
			<BaseModal open={deleteAllModalOpen} onClose={OnDeleteAllModalClosed} title={"Delete Confirmation"} maxWidth={"xs"}>
				<Stack spacing={4}>
					<Typography variant={"h6"} color={"white"}>
						Are you sure you want to clear your Song List?
					</Typography>
					<Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
						<Button variant={"contained"} onClick={OnDeleteAllConfirmed}>
							Yes
						</Button>
						<Button variant={"contained"} onClick={OnDeleteAllModalClosed}>
							No
						</Button>
					</Stack>
				</Stack>
			</BaseModal>
		</>
	)
}