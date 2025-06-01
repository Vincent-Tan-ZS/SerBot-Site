import {Box, Stack, Tab, Tabs, Typography} from "@mui/material";
import AppBody from "../../components/AppBody";
import React from "react";
import {ApiFetcher} from "../../Utils";
import useSWR from "swr";
import LoadingBox from "../../components/LoadingBox";
import styled from "@emotion/styled";

const LeaderboardType = {
	Misclick_Voice: 1
};

const StyledTab = styled(Tab)(({ theme }) => ({
  color: 'gray'
}));

const LeaderboardPodium = (props) => {
	const { height, ranking, rankingColor } = props;

	return (
		<Box height={height} width={'8rem'} sx={{ backgroundColor: '#eee', border: '2px solid gray' }}>
			<Box sx={{ background: rankingColor, border: '2px solid black', borderRadius: '999px', width: '35%', justifySelf: 'center', mt: '0.25rem' }}>
				<Typography color={'black'} textAlign={'center'} variant={'h4'}>{ranking}</Typography>
			</Box>
		</Box>
	);
}

const MisclickLeaderboard = () => {
	const { data, isValidating, mutate } = useSWR("/api/getMisclick", ApiFetcher);

	console.log(data);

	return (
		<>
			{
				isValidating === true &&
				<LoadingBox />
			}
			{
				isValidating !== true &&
				<Stack spacing={1} height='100%' alignItems={'center'}>
					<Stack direction={"row"} height={'20rem'} alignItems={'flex-end'}>
						<LeaderboardPodium height={'50%'} ranking={2} rankingColor={'silver'} />
						<LeaderboardPodium height={'80%'} ranking={1} rankingColor={'gold'} />
						<LeaderboardPodium height={'20%'} ranking={3} rankingColor={'#977547'} />
					</Stack>
				</Stack>
			}
		</>
	);
}

function Leaderboard(props)
{
	const [leaderboardType, setLeaderboardType] = React.useState(LeaderboardType.Misclick_Voice);

	const OnLeaderboardSelected = (e, val) => {
		setLeaderboardType(val);
	}

	const RenderLeaderboard = () => {
		switch (leaderboardType)
		{
			case LeaderboardType.Misclick_Voice:
				return <MisclickLeaderboard />;
			default:
				return <Typography>No leaderboard selected</Typography>;
		}
	}

	return (
		<AppBody>
			<Stack spacing={2} height={'100%'}>
				<Tabs value={leaderboardType} variant={"scrollable"} onChange={OnLeaderboardSelected}>
					{
						Object.entries(LeaderboardType).map(([k, v]) => 
							<StyledTab key={`leaderboard-${v}`} label={k.replaceAll('_', ' ')} value={v}/>
						)
					}
				</Tabs>
				{RenderLeaderboard()}
			</Stack>
		</AppBody>
	)
}

export default Leaderboard;