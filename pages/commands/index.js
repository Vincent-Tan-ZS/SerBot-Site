import {Accordion, AccordionDetails, AccordionSummary, Chip, Divider, IconButton, ImageList, ImageListItem, List, ListItem, ListItemText, Paper, Stack, Typography} from "@mui/material";
import { ContentCopy as CopyIcon, ExpandMore } from '@mui/icons-material';
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
import { MobileContext } from "../../contexts/MobileContext";

const helperText = "Search for a specific Command via Title or Description";

const CommandChips = (props) => {
	const { commandList } = props;

	return (
		<Stack direction={"row"} gap={1} sx={{ scrollbarWidth: "thin", overflowX: 'auto' }}>
			{commandList.map(li => <Chip key={li} size={"small"} variant={"outlined"} label={li} sx={{color: "white", borderRadius: "8px", background: "dimgray" }} />)}
		</Stack>
	)
}

const CommandDescription = (props) => {
	const { description } = props;

	return (
		<Typography variant={"caption"} color={"white"}>{description}</Typography>
	)
}

const CommandUsages = (props) => {
	const { command, onCopyClicked } = props;

	const MappedUsages = useMemo(() => {
		if (!command) return [];
		return command.Usage.map((usage) => `ser ${command.List[0]} ${usage}`.trim());
	}, [command.List, command.Usage]);

	return (
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
	)
}

const CommandCard = (props) => {
	const { command, onCopyClicked } = props;

	const isMobile = React.useContext(MobileContext);

	return (
		<>
			{isMobile &&
				<Accordion sx={{ background: '#111F42' }}>
					<AccordionSummary expandIcon={<ExpandMore htmlColor="white" />}>
						<Stack gap={1}>
							<Stack direction={"row"} gap={1}>
								<Typography color={"white"}>{command.Title}</Typography>
								<CommandChips commandList={command.List} />
							</Stack>
							<CommandDescription description={command.Description} />
						</Stack>
					</AccordionSummary>
					<AccordionDetails>
						<CommandUsages command={command} onCopyClicked={onCopyClicked} />
					</AccordionDetails>
				</Accordion>
			}
			{!isMobile && 
			<Paper elevation={2} sx={{ maxWidth: '260px', minHeight: '260px', maxHeight: '300px', height: '300px', background: '#111F42', padding: '8px', display: 'flex', flexDirection: "column", border: 'solid #1A7AFF 1px' }}>
				<Stack gap={1} p={1} >
					<Typography color={"white"}>
						{command.Title}
					</Typography>
					<CommandChips commandList={command.List} />
				</Stack>
				<Divider sx={{ background: '#1A7AFF' }} />
				<Stack p={1} gap={1} sx={{ flex: 1, minHeight: 0 }}>
					<CommandDescription description={command.Description} />
					<CommandUsages command={command} onCopyClicked={onCopyClicked} />
				</Stack>
			</Paper>
			}
		</>
	)
}

function Commands() {
	const snackbarStates = React.useContext(SnackbarContext);
	const modalStates = React.useContext(ModalContext);
	const isMobile = React.useContext(MobileContext);

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

						{
							isMobile &&
							<Stack gap={1} sx={{ height: '100%', overflowY: 'auto' }}>
								{
									commandList.map(command => {
										return (
											<CommandCard key={command.Title} command={command} onCopyClicked={OnCopyClicked} />
										)
									})
								}
							</Stack>
						}

						{
							(!isMobile && commandList.length > 0) &&
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