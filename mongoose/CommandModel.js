import mongoose from "mongoose";

// Commands
const commandSchema = mongoose.Schema({
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

export default mongoose.models.Commands || mongoose.model('Commands', commandSchema, 'Commands');