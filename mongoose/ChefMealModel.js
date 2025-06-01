import { Schema, model, models } from "mongoose";

// Chef Meal
const chefMealSchema = Schema({
    Id: {
        type: Number,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Ingredients: {
        type: Array,
        required: true
    },
    Steps: {
        type: Array,
        required: true
    },
    AddedBy: {
        type: String,
        required: true
    }
});
const collection = "ChefMeals";
export default models?.ChefMeal || model("ChefMeal", chefMealSchema, collection);