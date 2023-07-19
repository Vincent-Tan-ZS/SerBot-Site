import {Button, CircularProgress, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography, styled} from "@mui/material";
import axios from "axios";
import React from "react";
import {SnackbarContext} from "../../contexts/SnackbarContext";
import {ModalContext} from "../../contexts/ModalContext";
import {SetErrorSnackbar} from "../../Utils";
import {CheckCircleTwoTone} from "@mui/icons-material";

const InputPlaylist = styled(TextField)`
	.MuiFormHelperText-root {
		color: white;
		font-style: italic;
	}
`;

const PlatformRadioGroup = styled(RadioGroup)`
	.MuiRadio-root {
		color: white;
	}

	.MuiTypography-root {
		color: white;
	}
`;

const ImportStates = {
	PreImport: 0,
	Importing: 1,
	ImportSuccess: 2,
}

export default function ImportSongsModalChild(props) {
	const { refresh } = props;

	const snackbarStates = React.useContext(SnackbarContext);
	const modalStates = React.useContext(ModalContext);

	const [platform, setPlatform] = React.useState("spotify");
	const [playlistId, setPlaylistId] = React.useState("");
	const [importState, setImportState] = React.useState(ImportStates.PreImport);

	const [spotifyToken, setSpotifyToken] = React.useState("");

	const OnPlatformChanged = (e, v) => {
		setPlatform(v);
	}

	const OnPlaylistIdChanged = (e) => {
		setPlaylistId(e.target.value);
	}

	const OnImportClicked = async () => {
		try
		{
			setImportState(ImportStates.Importing);
			const userId = sessionStorage.getItem("DiscordUserId");
			const userName = sessionStorage.getItem("DiscordUserName");

			switch (platform)
			{
				case "spotify":
					let spotifyAccessToken = spotifyToken;
		
					if (spotifyAccessToken.length <= 0)
					{
						const resp = await axios.get("./api/spotify/token");
						setSpotifyToken(resp.data.token);
						spotifyAccessToken = resp.data.token;
					}
		
					await axios.post("./api/spotify/playlist", {
						playlistId: playlistId,
						accessToken: spotifyAccessToken,
						userId: userId,
						username: userName
					});
					break;
				case "yt":
					await axios.post("./api/youtube/playlist", {
						playlistId: playlistId,
						userId: userId,
						username: userName
					});
					break;
			}

			refresh();
			setImportState(ImportStates.ImportSuccess);
		}
		catch(err)
		{
			SetErrorSnackbar(snackbarStates, err.response.data.message);
			setImportState(ImportStates.PreImport);
		}
	}

	const OnCloseModal = () => {
		modalStates.setModalOpen(false);
	}

	return (
		<>
			{
				importState === ImportStates.PreImport &&
				<Stack height={'100%'} justifyContent={'space-between'}>
					<PlatformRadioGroup value={platform} onChange={OnPlatformChanged}>
						<FormControlLabel value="spotify" control={<Radio />} label="Spotify" />
						<FormControlLabel value="yt" control={<Radio />} label="Youtube" />
					</PlatformRadioGroup>
					<Stack spacing={1}>
						<InputPlaylist label={"Playlist ID"} value={playlistId} onChange={OnPlaylistIdChanged} helperText={"The playlist has to be public"}/>
						<Button variant={"contained"} disabled={platform.length <= 0 || playlistId.length <= 0} onClick={OnImportClicked}>Import</Button>
					</Stack>
				</Stack>
			}
			{
				importState === ImportStates.Importing &&
				<Stack spacing={2} alignItems={'center'} justifyContent={'center'} height={'100%'}>
					<CircularProgress />
					<Typography variant={"h6"} color={"white"}>
						Importing Playlist...
					</Typography>
				</Stack>
			}
			{
				importState === ImportStates.ImportSuccess &&
				<Stack spacing={2} alignItems={'center'} justifyContent={'center'} height={'100%'}>
					<CheckCircleTwoTone color={"success"} sx={{fontSize: "5rem"}}/>
					<Typography variant={"h6"} color={"white"}>
						Playlist Imported!
					</Typography>
					<Button variant={"contained"} onClick={OnCloseModal}>
						Close
					</Button>
				</Stack>
			}
		</>
	)
}