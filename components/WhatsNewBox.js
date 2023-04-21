import {Box, List, ListItem, Paper, Typography, styled} from "@mui/material";
import {format} from "date-fns";

const WhatsNewListPaper = styled(Paper)`
	height: 200px;
	border: 2px solid #0E4686;
	background: black;
	overflow-y: auto;

	.MuiList-root {
		padding-top: 0px;
		padding-bottom: 0px;

		.MuiListItem-root {
			&:nth-child(odd) {
				background: #0c0c0c;
			}

			&:nth-child(even) {
				background: #191919;
			}

			color: white;
		}
	}
`;

export default function WhatsNewBox(props) {
	const { title, data } = props;

	return (
		<Box>
			<Typography variant={"h4"}>What's New: {title}</Typography>
			<WhatsNewListPaper>
				<List>
					{
						data.map((d) => <ListItem>[{format(d.FeatureDate, "dd/MM/yyyy")}] {d.FeatureUpdateMessage}</ListItem>)
					}
				</List>
			</WhatsNewListPaper>
		</Box>
	)
}