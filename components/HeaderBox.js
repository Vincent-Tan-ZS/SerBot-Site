import {Divider, Stack, styled} from "@mui/material";

const StyledDivider = styled(Divider)`
	border-color: #1A7AFF;
	width: 100%;
`;

export default function HeaderBox(props)
{
	return (
		<Stack sx={props.sx} direction={"column"} gap={2}>
			{props.children}
			<StyledDivider />
		</Stack>
	)
};