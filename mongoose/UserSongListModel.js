import { Schema, model, models } from "mongoose";

// UserSongList
const userSongListSchema = Schema({
    UserId: {
        type: String,
        required: true
    },
    UserName: {
        type: String,
        required: true
    },
    SongList: {
        type: Array,
        required: true
    }
});
const collection = "UserSongLists";
export default models?.UserSongList || model("UserSongList", userSongListSchema, collection);