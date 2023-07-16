import { Schema, model, models } from "mongoose";

// UserSongList
const userSongListSchema = Schema({
    UserId: {
        type: String,
        required: true
    },
	UserName: {
		type: String,
		require: true
	},
	UserImage: {
		type: String,
		require: true
	},
    SongList: {
        type: Array,
        required: true
    }
});

export { userSongListSchema };
export default models?.UserSongList || model("UserSongList", userSongListSchema, "UserSongLists");