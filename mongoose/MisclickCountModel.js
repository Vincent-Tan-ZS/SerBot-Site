import { Schema, model, models } from "mongoose";

// Misclick Count
const misclickCountSchema = Schema({
    Username: {
        type: String,
        required: true
    },
    AvatarUrl: {
        type: String,
        required: true
    },
    Count: {
        type: Number,
        required: true
    }
});
const collection = "MisclickCount";
export default models?.MisclickCount || model("MisclickCount", misclickCountSchema, collection);