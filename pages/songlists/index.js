import {Accordion, AccordionDetails, AccordionSummary, Button, List, ListItem, Stack, Typography, styled} from "@mui/material";
import AppBody from "../../components/AppBody";
import React from "react";
import {Add, Edit, ExpandMore} from "@mui/icons-material";
import {ModalContext} from "../../contexts/ModalContext";
import AuthCodeModalChild from "../../components/Modals/AuthCodeModalChild";

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
		overflow-y: scroll;
	}
`;

const AccordionStack = styled(Stack)`
	height: 100%;
	overflow-y: auto;
`;

const UserSongsAccordion = (props) => {
	const { username, songList } = props;
	
	return (
		<UserSongsAccordionStyle>
			<AccordionSummary id={`${username}-songs`} expandIcon={<ExpandMore />}>
				<Typography>
					{username}
				</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<List disablePadding>
					<ListItem>Test</ListItem>
				</List>
			</AccordionDetails>
		</UserSongsAccordionStyle>
	)
}

const fetcher = (...args) => fetch(...args).then(res => res.json());

function SongLists()
{
	// const { data, isValidating } = useSWRImmutable("/api/songLists", fetcher)

	const modalStates = React.useContext(ModalContext);

	const OnButtonClicked = (type) => () => {
		modalStates.setModalOpen(true);
		modalStates.setModalChildren(<AuthCodeModalChild />);
	}

	return (
		<>
			<AppBody>
				<Stack spacing={1} height='100%'>
					<Stack direction={"row"} spacing={1} paddingTop={1} paddingBottom={1}>
						<Button variant={"contained"} onClick={OnButtonClicked("Add")}>
							<Add fontSize="small" />&nbsp;Add my list
						</Button>
						<Button variant={"contained"} onClick={OnButtonClicked("Update")}>
							<Edit fontSize="small" />&nbsp;Update my list
						</Button>
					</Stack>
					<AccordionStack spacing={1}>
						<UserSongsAccordion username={"Test"} />
					</AccordionStack>
				</Stack>
			</AppBody>
		</>
	)
}

export default SongLists;