import { Schema, model, models } from "mongoose";

// UserSongList
const userSongListSchema = Schema({
    UserId: {
        type: String,
        required: true
    },
    SongList: {
        type: Array,
        required: true
    }
});

export default models?.UserSongList || model("UserSongList", userSongListSchema, "UserSongLists");