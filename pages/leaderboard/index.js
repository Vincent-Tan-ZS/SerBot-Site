import {Box, Stack, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Typography} from "@mui/material";
import AppBody from "../../components/AppBody";
import React from "react";
import {ApiFetcher} from "../../Utils";
import useSWR from "swr";
import LoadingBox from "../../components/LoadingBox";
import styled from "@emotion/styled";
import { Person } from "@mui/icons-material";
import AppTableContainer from "../../components/AppTableContainer";

const LeaderboardType = {
	Misclick_Voice: 1
};

const DefaultPodiumProperties = [
	{
		height: '50%',
		ranking: 2,
		rankingColor: 'silver'
	},
	{
		height: '70%',
		ranking: 1,
		rankingColor: 'gold'
	},
	{
		height: '30%',
		ranking: 3,
		rankingColor: '#977547'
	},
];

const StyledTab = styled(Tab)(() => ({
  color: 'gray'
}));

const Image = styled('img', {shouldForwardProp: prop => prop !== "size"})(({ size }) => `
	border-radius: 50%;
	height: ${size};
	width: ${size};
`);

const UserImage = (props) => {
	const { image, size } = props;

	const [hasErr, setHasErr] = React.useState(false);

	const imgSize = size ?? '5rem';

	if (image === undefined || image === null || image?.length <= 0 || hasErr === true) return <Person />
	return <Image src={image} size={imgSize} onError={() => setHasErr(true)} />
}

const LeaderboardPodium = (props) => {
	const { height, ranking, rankingColor, rankingText, rankingText2, rankingImageUrl } = props;

	return (
		<Stack spacing={1} height={'100%'} alignItems={'center'} justifyContent={'flex-end'}>
			<UserImage image={rankingImageUrl} />
			<Box height={height} width={'12.5rem'} sx={{ backgroundColor: '#eee', border: '2px solid gray' }}>
				<Box sx={{ background: rankingColor, border: '2px solid black', borderRadius: '50%', width: '20%', justifySelf: 'center', mt: '0.25rem' }}>
					<Typography color={'black'} textAlign={'center'} variant={'h5'}>{ranking}</Typography>
				</Box>
				<Typography color={'black'} textAlign={'center'} variant={'h6'}>{rankingText}</Typography>
				<Typography sx={{ lineHeight: '0.5' }} color={'black'} textAlign={'center'} variant={'body1'}>{rankingText2}</Typography>
			</Box>
		</Stack>
	);
}

const MisclickLeaderboard = () => {
	const { data, isValidating } = useSWR("/api/getMisclick", ApiFetcher);

	const [sortedData, setSortedData] = React.useState([]);

	React.useEffect(() => {
		setSortedData((data ?? []).sort((a, b) => b.Count - a.Count));
	}, [data]);

	return (
		<>
			{
				isValidating === true &&
				<LoadingBox />
			}
			{
				isValidating !== true &&
				<Stack spacing={2} height='100%' alignItems={'center'}>
					<Stack direction={"row"} height={'20rem'}>
						{
							DefaultPodiumProperties.map((p) => 
								<LeaderboardPodium key={`leaderboard-podium-${p.ranking}`} height={p.height} ranking={p.ranking} rankingColor={p.rankingColor}
									rankingText={sortedData[p.ranking-1]?.Username} rankingText2={`${sortedData[p.ranking-1]?.Count} clicks`} rankingImageUrl={sortedData[p.ranking-1]?.AvatarUrl} />
							)
						}
					</Stack>
					<AppTableContainer>
						<Table size={"small"}>
							<TableHead>
								<TableRow>
									<TableCell>Ranking</TableCell>
									<TableCell>Avatar</TableCell>
									<TableCell>Username</TableCell>
									<TableCell>Click Count</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{
									sortedData.slice(3).map((d, index) => 
										<TableRow>
											<TableCell>{index + 3 + 1}</TableCell>
											<TableCell>
												<UserImage image={d.AvatarUrl} size={'2rem'} />
											</TableCell>
											<TableCell>{d.Username}</TableCell>
											<TableCell>{d.Count}</TableCell>
										</TableRow>
									)
								}
							</TableBody>
						</Table>
					</AppTableContainer>
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