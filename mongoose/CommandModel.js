import { Schema, model, models } from "mongoose";

// Commands
const commandSchema = Schema({
    Title: {
        type: String,
        required: true
    },
    List: {
        type: Array,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Usage: {
        type: Array,
        required: true
    }
});
const collection = "Commands";
export default models?.Command || model("Command", commandSchema, collection);