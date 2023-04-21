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
		font-size: 1.2rem;

		.MuiListItem-root {
			&:nth-of-type(odd) {
				background: #0c0c0c;
			}

			&:nth-of-type(even) {
				background: #191919;
			}

			color: white;
		}
	}
`;

export default function WhatsNewBox(props) {
	const { title, data } = props;
	
	const sortedData = data.sort((a, b) => new Date(b.FeatureDate) - new Date(a.FeatureDate)).slice(0, 10);

	return (
		<Box>
			<Typography variant={"h4"}>What's New: {title}</Typography>
			<WhatsNewListPaper>
				<List>
					{
						sortedData.map((d, ind) => <ListItem key={`whatsnew-${title}-${ind}`}>[{format(new Date(d.FeatureDate), "dd/MM/yyyy")}] {d.FeatureUpdateMessage}</ListItem>)
					}
				</List>
			</WhatsNewListPaper>
		</Box>
	)
}