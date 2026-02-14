import mongoosePaginate from "mongoose-paginate-v2";
import { Schema, model } from 'mongoose';

const PostSchema = new Schema({
    postImage: {type: String, required: false},
    slug: {type: String, required: true},
    title: {type: String, required: true},
    content: {type: String, required: true},
    likes: {
        count: { type: Number, default: 0 },
        user: [{ref: "users", type: Schema.Types.ObjectId}]
    },    
    comments: [{
        text: {type: String, required: true},
        user: [{ref: "users", type: Schema.Types.ObjectId}]
    }],
    author: {ref:"users", type: Schema.Types.ObjectId}
}, {timestamps:true});

PostSchema.plugin(mongoosePaginate);

const Post = model("posts", PostSchema);

export default Post;