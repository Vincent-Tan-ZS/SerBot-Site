import { Schema, model, models } from "mongoose";

const countdownSchema = Schema({
    Name: {
        type: String,
        required: true
    },
    Date: {
        type: Date
    },
    Description: {
        type: String
    },
    Image: {
        type: String
    },
    URL: {
        type: String
    }
});

export default models?.Countdown || model("Countdown", countdownSchema, "Countdown");