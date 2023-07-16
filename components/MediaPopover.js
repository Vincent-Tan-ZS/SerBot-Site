import {Box, Popover, styled} from "@mui/material";

const mediaHeight = 250;
const mediaWidth = 350;

const MediaPopoverStyle = styled(Popover)`
	.MuiPaper-root {
		background: #393a41;
	}

	.MuiBox-root {
		margin: 8px;
		height: ${mediaHeight}px;
		width: ${mediaWidth}px;
	}
`;

export default function MediaPopover(props) {
	const { anchor, onClose, link } = props;

	return (
		<MediaPopoverStyle id="media-popover" open={Boolean(anchor)} anchorOrigin={{vertical: 'top', horizontal: 'right'}} anchorEl={anchor} onClose={onClose}>
			<Box>
				<iframe width={mediaWidth} height={mediaHeight} src={link} />
			</Box>
		</MediaPopoverStyle>
	)
}