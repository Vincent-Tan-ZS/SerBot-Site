import { Schema, model, models } from "mongoose";

// Site Authorization
const siteAuthorizationSchema = Schema({
    UserId: {
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

export default models?.SiteAuthorization || model("SiteAuthorization", siteAuthorizationSchema, "SiteAuthorizations");