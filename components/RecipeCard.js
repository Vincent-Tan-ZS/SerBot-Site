
import React from "react";
import { Card, Typography, css, keyframes, styled } from "@mui/material";
import { zoomIn } from "react-animations";
import { ModalContext } from "../contexts/ModalContext";
import ViewRecipeModalChild from "./Modals/ViewRecipeModalChild";

const zoomInAnimation = keyframes`${zoomIn}`;

const BaseCardStyle = css`
	box-shadow: 0px 0px 8px 4px #0E4686;
	background-color: #24252C;
	color: white;

	&.hide {
		opacity: 0%;
	}

	&.show {
		opacity: 100%;
	}

	animation: 0.2s ${zoomInAnimation} forwards;

	display: flex;
	flex-direction: column;
	justify-content: space-between;

	:hover {
		box-shadow: 0px 0px 8px 8px #3e6a9e;
	}
`;

const RecipeCardStyle = styled(Card) `
	${BaseCardStyle}

	padding: 8px;
`;

export default function RecipeCard(props) {
	const { recipe, animationDelay } = props;
	const modalStates = React.useContext(ModalContext);

	const [opacityClass, setOpacityClass] = React.useState("hide");

	const OnCardAnimationStart = (e) => {
		setOpacityClass("show");
	}

	const OnViewRecipe = () => {
		modalStates.setModalOpen(true);
		modalStates.setModalTitle(recipe.Name);
		modalStates.setModalChildren(<ViewRecipeModalChild recipe={recipe} />);
	}

	return (
		<RecipeCardStyle onClick={OnViewRecipe} sx={{animationDelay: animationDelay, cursor: "pointer"}} className={opacityClass} onAnimationStart={OnCardAnimationStart}>
			<Typography>{recipe.Name} <em style={{"fontSize": "12px"}}>by {recipe.AddedBy}</em></Typography>
        </RecipeCardStyle>
	)
}