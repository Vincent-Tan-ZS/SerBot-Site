import {Divider, Stack, styled} from "@mui/material";

const StyledDivider = styled(Divider)`
	border-color: #1A7AFF;
	width: 100%;
`;

export default function HeaderBox(props)
{
	return (
		<Stack direction={"column"} gap={2}>
			{props.children}
			<StyledDivider />
		</Stack>
	)
};