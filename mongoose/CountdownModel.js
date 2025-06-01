import { Schema, model, models } from "mongoose";

const countdownSchema = Schema({
    Name: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        required: true
    },
    Description: {
        type: String
    },
    Image: {
        type: String
    },
    URL: {
        type: String
    },
    UserId: {
        type: String,
        required: true
    }
});
const collection = "Countdown";
export default models?.Countdown || model("Countdown", countdownSchema, collection);