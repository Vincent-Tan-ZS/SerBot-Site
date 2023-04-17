import styled from "@emotion/styled";
import {Pagination} from "@mui/material";

const AppPaginationStyle = styled(Pagination)`
	.MuiPaginationItem-root {
		color: white;
	}
`;

export default function AppPagination(props)
{
	const { pageState, total } = props;
	const { curPage, setCurPage } = pageState;

	const OnPageChange = (e, _page) => {
		setCurPage(_page);
	}

	return(
		<AppPaginationStyle page={curPage} onChange={OnPageChange} count={total} color={"primary"} />
	)
}