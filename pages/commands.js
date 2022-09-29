import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";
import MainContainer from "../components/MainContainer";
import styles from '../styles/Commands.module.scss';

function Commands(props) {
	const { list } = props;

	const [commandList, setCommandList] = React.useState([]);

	React.useEffect(() => {
		let _list = list.map(li => {
			let _usage = li.Usage.map(u => `ser ${li.List[0]} ${u}`.trim());

			return {
				Title: li.Title,
				List: li.List,
				Description: li.Description,
				Usage: _usage
			}
		});

		setCommandList(_list);
	}, [list]);

	return (
		<MainContainer>
			<Box />
			<TableContainer>
				<Table className={styles.commandsTable}>
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Commands</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Usage</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{
							commandList.length > 0 &&
							commandList.map(li => {
								return (
									<TableRow key={`command-${li.Title}`}>
										<TableCell size="small">{li.Title}</TableCell>
										<TableCell size="small">{li.List.join()}</TableCell>
										<TableCell size="small">{li.Description}</TableCell>
										<TableCell size="small">{li.Usage.join(" | ")}</TableCell>
									</TableRow>
								)
							})
						}
					</TableBody>
				</Table>
			</TableContainer>	
		</MainContainer>
	)
}

export const getServerSideProps = async () => {
	let data = [];

	try
	{
		const resp = await fetch(`http://${process.env.DOMAIN_NAME}:${process.env.DOMAIN_PORT}/api/command`);
		const respData = await resp.json();

		data = respData.data;
	}
	catch (e)
	{
		console.log(e.message);
	}
	finally
	{
		return {
			props: {
				list: data
			}
		};
	}
}

export default Commands;