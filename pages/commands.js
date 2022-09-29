import React from "react";

function Commands(props) {
	const [commandList, setCommandList] = React.useState([]);

	React.useEffect(() => {
		fetch(`./api/command`).then((resp) => {
			resp.json().then((respData) => {
				setCommandList(respData.data);	
			})
			.catch((reason) => {
				console.log(reason);
			});
		})
		.catch((reason) => {
			console.log(reason);
		});
	}, []);

	return (
		<ul>
			{
				commandList.map(l => <li>{l.Title}</li>)
			}
		</ul>
	)
}

export default Commands;