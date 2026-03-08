import {Chip, Divider, IconButton, ImageList, ImageListItem, List, ListItem, ListItemText, Paper, Stack, Typography} from "@mui/material";
import { ContentCopy as CopyIcon } from '@mui/icons-material';
import React, { useMemo } from "react";
import AppBody from "../../components/AppBody";
import useSWRImmutable from "swr/immutable"; 
import {ApiFetcher, CopyToClipboard } from "../../Utils";
import SearchInput from "../../components/SearchInput";
import HeaderBox from "../../components/HeaderBox";
import {SnackbarContext} from "../../contexts/SnackbarContext";
import {ModalContext} from "../../contexts/ModalContext";
import {CopyCommandsModalChild} from "../../components/Modals/CopyCommandsModalChild";
import LoadingBox from "../../components/LoadingBox";

const helperText = "Search for a specific Command via Title or Description";

const CommandCard = (props) => {
	const { command, onCopyClicked } = props;

	const MappedUsages = useMemo(() => {
		return command.Usage.map((usage) => `ser ${command.List[0]} ${usage}`.trim());
	}, [command.List, command.Usage]);

	return (
		<Paper elevation={2} sx={{ maxWidth: '260px', minHeight: '260px', maxHeight: '300px', height: '300px', background: '#111F42', padding: '8px', display: 'flex', flexDirection: "column", border: 'solid #1A7AFF 1px' }}>
			<Stack direction={"row"} gap={1} p={1} >
				<Typography color={"white"}>
					{command.Title}
				</Typography>
				<Stack direction={"row"} gap={1} sx={{ scrollbarWidth: "thin", overflowX: 'auto' }}>
					{command.List.map(li => <Chip key={li} size={"small"} variant={"outlined"} label={li} sx={{color: "white", borderRadius: "8px", background: "dimgray" }} />)}
				</Stack>
			</Stack>
			<Divider sx={{ background: '#1A7AFF' }} />
			<Stack p={1} gap={1} sx={{ flex: 1, minHeight: 0 }}>
				<Typography variant={"caption"} color={"white"}>{command.Description}</Typography>
				<Paper sx={{ overflowY: 'auto', flex: 1, minHeight: 0, background: 'black' }}>
					<List disablePadding sx={{ background: '#0044A3' }}>
						{MappedUsages.map((usage) => (
							<ListItem key={usage} sx={{ border: '#1A7AFF solid 2px' }} dense secondaryAction={
								<IconButton size={"small"} edge="end" onClick={onCopyClicked(usage)}>
									<CopyIcon htmlColor="white" />
								</IconButton>
							}>
								<ListItemText sx={{ color: "white" }}>
									{usage}
								</ListItemText>
							</ListItem>
						))}
					</List>
				</Paper>
			</Stack>
		</Paper>
	)
}

function Commands() {
	const snackbarStates = React.useContext(SnackbarContext);
	const modalStates = React.useContext(ModalContext);

	// List States
	const { data, isValidating } = useSWRImmutable(`/api/command`, ApiFetcher)
	const [commandList, setCommandList] = React.useState([]);

	// Filter States
	const [filterText, setFilterText] = React.useState("");

	React.useEffect(() => {
		const newCommandList = (data ?? []).filter((c) => 
			c.Title.toLowerCase().includes(filterText.toLowerCase()) || c.List.find(l => l.toLowerCase().includes(filterText.toLowerCase())) !== undefined
		);
		setCommandList(newCommandList);
	}, [filterText, data]);

	const OnCopyClicked = (usage) => () => {
		const matches = usage.match(/{.+?}|@\w+|[[]\w+?]/g);

		if (matches === null)
		{
			CopyToClipboard(snackbarStates, usage);
		}
		else
		{
			const mentions = matches.filter(m => m.startsWith("@"));
			const days = matches.filter(m => m.startsWith("["));
			const options = matches.filter(m => m.startsWith("{"));

			modalStates.OpenModal({
				title: "Copy Command",
				maxWidth: "md",
				children: <CopyCommandsModalChild command={usage} options={options} mentions={mentions} days={days} />
			});
		}
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
					<Stack spacing={1} flexDirection={"column"} height={"100%"}>
						<HeaderBox>
							<SearchInput filterState={{filterText, setFilterText}} helperText={helperText} />
						</HeaderBox>
						
						{commandList.length > 0 &&
							<ImageList cols={4} gap={12}>
								{
									commandList.map(command => {
										return (
											<ImageListItem>
												<CommandCard key={command.Title} command={command} onCopyClicked={OnCopyClicked} />
											</ImageListItem>
										)
									})
								}
							</ImageList>
						}
					</Stack>
				}
			</AppBody>
		</>
	)
}

export default Commands;