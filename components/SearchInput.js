import React from "react";
import TextInput from "./TextInput";
import styled from "@emotion/styled";

const SearchInputStyle = styled(TextInput)`
	width: 80%;

	.MuiInput-input {
		height: 4rem;
		font-size: 24px;
	}
`;

export default function SearchInput(props)
{
	const { filterState, helperText } = props;
	const { filterText, setFilterText } = filterState;

	const [helper, setHelper] = React.useState("");

	const OnInputChanged = (e) => {
		setFilterText(e.target.value);

		const _helperText = e.target.value.length > 0 ? helperText : "";
		setHelper(_helperText);
	}

	return (
		<SearchInputStyle variant="standard" value={filterText} onChange={OnInputChanged} placeholder={helperText} helperText={helper} />
	)
}