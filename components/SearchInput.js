import styled from "@emotion/styled";
import { Box, InputAdornment, TextField } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const SearchInputStyle = styled(TextField)`
	width: 60%;

	.MuiInputBase-root {
		color: white;
	}

	.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
		border-color: #999;
		}
	}

	.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
		border-color: #aaa !important;
	}

	.MuiOutlinedInput-root:focus .MuiOutlinedInput-notchedOutline {
		border-color: #aaa !important;
	}
`;

export default function SearchInput(props)
{
	const { filterState, helperText } = props;
	const { filterText, setFilterText } = filterState;

	const OnInputChanged = (e) => {
		setFilterText(e.target.value);
	}

	return (
		<SearchInputStyle variant="outlined"
			size={"small"}
			value={filterText}
			onChange={OnInputChanged}
			placeholder={helperText}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end" sx={{
						borderLeft: '1px solid white',
						height: '100%',
						paddingLeft: 1.5,
						display: 'flex',
						alignItems: 'center',
						pointerEvents: 'none',
						}}
					>
						<SearchIcon htmlColor={"#ccc"} />
					</InputAdornment>
				)
			}} />
	)
}