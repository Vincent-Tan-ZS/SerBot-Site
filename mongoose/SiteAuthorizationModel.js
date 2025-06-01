import { Schema, model, models } from "mongoose";

// Site Authorization
const siteAuthorizationSchema = Schema({
    UserId: {
        type: String,
        required: true
    },
    UserName: {
        type: String,
        required: true
    },
    AuthCode: {
        type: String,
        required: true
    },
	ExpiresOn: {
		type: Date,
		require: true
	}
});
const collection = "SiteAuthorizations";
export default models?.SiteAuthorization || model("SiteAuthorization", siteAuthorizationSchema, collection);