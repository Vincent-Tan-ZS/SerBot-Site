import { Paper, Stack, styled, Typography } from "@mui/material";
import { useCallback } from "react";

const MobileRecipeCard = styled(Paper)(({ theme }) =>`
    background: linear-gradient(90deg, #111F42 0%, #111F42 50%, transparent 100%);

    padding: 8px;
    border: 2px solid #1A7AFF;

    em {
        color: #aaa;
        font-size: 12px;
    }
`);

export default function MobileRecipeListItem(props)
{
    const { recipe, onClick } = props;

    const GetTruncatedIngredients = useCallback(() => {
        const firstFiveIngredients = recipe.Ingredients.slice(0, 5);
        let stringifiedIngredients = firstFiveIngredients.join(', ');

        if (recipe.Ingredients.length > 5)
        {
            stringifiedIngredients += `, ...`;
        }
        return stringifiedIngredients;
    }, [recipe.Ingredients]);

    return (
        <MobileRecipeCard onClick={onClick}>
            <Stack>
                <Typography color={"white"}>{recipe.Name} <em>{recipe.AddedBy}</em></Typography>
                <Typography variant={"caption"} fontStyle={"italic"} color={"#ccc"}>{GetTruncatedIngredients()}</Typography>
            </Stack>
        </MobileRecipeCard>
    )
}