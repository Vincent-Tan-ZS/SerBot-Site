import styled from "@emotion/styled";
import { debounce, InputAdornment, TextField } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useCallback, useState } from "react";

const SearchInputStyle = styled(TextField)`
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
	const { filterState, helperText, fullWidth } = props;
	const { filterText, setFilterText } = filterState;

	const [localText, setLocalText] = useState(filterText);

	const OnInputChanged = (e) => {
		setLocalText(e.target.value);
		debouncedChangeHandler(e.target.value);
	}

	const debouncedChangeHandler = useCallback(
		debounce((searchValue) => setFilterText(searchValue), 500),
	[]);

	return (
		<SearchInputStyle variant="outlined"
			size={"small"}
			value={localText}
			onChange={OnInputChanged}
			placeholder={helperText}
			sx={{ width: fullWidth ? '100%' : '60%' }}
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