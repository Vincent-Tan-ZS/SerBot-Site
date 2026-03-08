import { Circle } from "@mui/icons-material";
import {Divider, List, ListItem, ListItemIcon, ListItemText, Paper, Stack, styled, Typography} from "@mui/material";
import {format} from "date-fns";
import { useMemo } from "react";

const WhatsNewListPaper = styled(Paper)`
	height: 200px;
	border: 2px solid #0E4686;
	background: black;
	overflow-y: auto;
	padding: 8px;

	.MuiList-root {
		.MuiListItem-root {
			color: white;
		}
	}
`;

export default function WhatsNewBox(props) {
	const { title, data } = props;

	const groupedData = useMemo(() => {
		const sortedData = data.sort((a, b) => new Date(b.FeatureDate) - new Date(a.FeatureDate));
		return Object.groupBy(sortedData, ({ FeatureDate }) => format(new Date(FeatureDate), "dd/MM/yyyy"));
	}
	, [data]);

	return (
		<WhatsNewListPaper>
			<Stack gap={1}>
				<Typography color={"white"} variant={"h5"}>{title}</Typography>
				<Divider sx={{ borderColor: "gray" }} />
				<Stack gap={1}>
					{
						Object.entries(groupedData).map(([date, changes]) => (
							<Stack gap={1} key={`whats-new-${title}-${date}`}>
								<Typography variant={"h6"} color={"#1A7AFF"}>{date}</Typography>
								<List dense disablePadding>
									{
										changes.map((c, i) => (
											<ListItem key={`${date}-${i}`}>
												<ListItemIcon  sx={{ minWidth: "36px" }}>
													<Circle htmlColor={"white"} fontSize={"6px"} />
												</ListItemIcon>
												<ListItemText>{c.FeatureUpdateMessage}</ListItemText>
											</ListItem>
										))
									}
								</List>
							</Stack>
						))
					}
				</Stack>
			</Stack>
		</WhatsNewListPaper>
	)
}