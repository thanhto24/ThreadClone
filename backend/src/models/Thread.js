const mongoose = require("mongoose");
const { Schema } = mongoose;

const threadSchema = new Schema(
    {
        user_id: { type: String, required: true},
        content: String,
        image_url: { type: String, default: null},
        like: { type: Number, default: 0},
        comment: { type: Number, default: 0},
        root_thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', default: null },
        media_type: { type: String, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Thread", threadSchema);
    