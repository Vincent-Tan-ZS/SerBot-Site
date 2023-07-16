import { Schema, model, models } from "mongoose";

// FeatureUpdate
const featureUpdateSchema = Schema({
    FeatureDate: {
        type: Date,
        required: true
    },
    FeatureType: {
        type: String,
        required: true
    },
    FeatureUpdateMessage: {
        type: String,
        required: true
    }
});

export default models?.FeatureUpdate || model("FeatureUpdate", featureUpdateSchema, "FeatureUpdate");