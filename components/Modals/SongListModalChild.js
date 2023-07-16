import {Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, styled} from "@mui/material";
import AppTableContainer from "../AppTableContainer";
import React from "react";
import axios from "axios";

export default function SongListModalChild(props) {
	const [newSong, setNewSong] = React.useState("");

	const OnNewSongChanged = (e) => {
		setNewSong(e.target.value);
	}

	const OnAddSongClicked = () => {
		axios.post(`./api/addNewSong`, {
			userId: "",
			username: "",
			userImage: "",
			song: newSong
		});
	}

	const OnDeleteSongClicked = () => {
		// axios.post(`./api/deleteSong`, {
		// 	userId: "",
		// 	song: newSong
		// });
	}

	return (
		<>
			<AppTableContainer>
				<Table stickyHeader>
					<colgroup>
						<col width={"70%"} />
						<col width={"30%"} />
					</colgroup>
					<TableHead>
						<TableRow>
							<TableCell>Song List/URL</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
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
		</>
	)
}