import { Checkbox, FormControlLabel, FormGroup, Stack, Typography } from "@mui/material";
import React from "react";

export default function ViewRecipeModalChild(props) {
	const { recipe } = props;

	return (
		<Stack gap={1}>
			<Stack gap={1}>
				<Typography color={"white"} variant={"h4"}>Ingredients</Typography>
				<FormGroup sx={{display: "block"}}>
					{
						recipe.Ingredients.map((ing, ind) => <FormControlLabel key={`ing-${ind}`} sx={{color: "white"}} control={<Checkbox style={{"color": "#3e6a9e"}} />} label={ing} />)
					}
				</FormGroup>
			</Stack>
			<Stack gap={1}>
				<Typography color={"white"} variant={"h4"}>Steps</Typography>
				<FormGroup>
					{
						recipe.Steps.map((step, ind) => <FormControlLabel key={`step-${ind}`} sx={{color: "white"}} control={<Checkbox style={{"color": "#3e6a9e"}} />} label={`${ind + 1}. ${step}`} />)
					}
				</FormGroup>
			</Stack>
		</Stack>
	)
}