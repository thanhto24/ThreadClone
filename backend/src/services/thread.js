const Thread = require("../models/Thread");
const Like_Thread = require("../models/Like_Thread");
const User = require("../models/User");

const createThread = async (user_id, content, image_url = null, root_thread = null, media_type = null) => {
    const thread = new Thread({
        user_id,
        content,
        image_url,
        root_thread,
        media_type,
    });
    return await thread.save();
};

const getThread = async (thread_id) => {
    return await Thread.findById(thread_id);
};

const getAllThreads = async () => {
    return await Thread.find().sort({ createdAt: -1 }).limit(20);
};

const getFollowerThreads = async (user_id) => {
    try {
        const user = await User.findOne({ user_id: user_id });
        if (!user) throw new Error("User not found");
        
        const following = user.following; 
        
        const threads = await Thread.find({ user_id: { $in: following } })
            .sort({ createdAt: -1 })
            .limit(20);

        return threads;
    } catch (error) {
        console.error("Error fetching follower threads:", error);
        throw error;
    }
};


const getNewestThreads = async () => {
    return await Thread.find().sort({ createdAt: -1 }).limit(20);
};

const getReplyThreads = async () => {
    return await Thread.find({ root_thread: { $ne: null } }).sort({ createdAt: -1 }).limit(20);
};

const getLikeThreads = async () => {
    return await Thread.find().sort({ like: -1 }).limit(20);
};

const getCommentThreads = async () => {
    return await Thread.find().sort({ comment: -1 }).limit(20);
};

const getThreadByUser = async (user_id) => {
    return await Thread.find({ user_id }).sort({ createdAt: -1 });
};

const getLikedThreads = async (user_id) => {
    try {
        const liked_threads = await Like_Thread.find({ user_id }, 'thread_id');
        const threadIds = liked_threads.map(thread => thread.thread_id);

        if (threadIds.length === 0) return [];

        return await Thread.find({ _id: { $in: threadIds } }).sort({ like: -1 });
    } catch (error) {
        console.error('Error in getLikedThreads:', error);
        throw new Error('Failed to fetch liked threads');
    }
};

const getCommentedThreads = async (user_id) => {
    try {
        const commented_threads = await Thread.find({ user_id, root_thread: { $ne: null } }).sort({ createdAt: -1 });
        return commented_threads;
    } catch (error) {
        console.error('Error in getCommentedThreads:', error);
        throw new Error('Failed to fetch commented threads');
    }
};


const createComment = async (user_id, content, image_url = null, root_thread = null, media_type = null) => {
    const thread = new Thread({
        user_id,
        content,
        image_url,
        root_thread,
        media_type,
    });
    await thread.save();

    original_thread = await Thread.findById(root_thread);
    original_thread.comment += 1;
    await original_thread.save();

    //console.log("Comment created successfully for thread:", original_thread);
    return thread;
};

const getComment = async (thread_id) => {
    return await Thread.find({ root_thread: thread_id }).sort({ createdAt: -1 });
};

const getLikePost = async (thread_id) => {
    try {
        // Tìm kiếm tài liệu theo _id
        const post = await Like_Thread.findOne({ thread_id: thread_id }); // Tìm kiếm theo thread_id

        // Kiểm tra xem có post không, nếu có thì trả về user_id
        return post ? post.user_id : [];  // trả về mảng các user_id đã tym post có id = thread_id
    } catch (error) {
        console.error("Error:", error);
        throw error; // Để bắt lỗi từ MongoDB hoặc bất kỳ lỗi nào khác
    }
};

const deleteThread = async (thread_id) => {
    return await Thread.findByIdAndDelete(thread_id);
};

module.exports = {
    createThread,
    getThread,
    getAllThreads,

    getNewestThreads,
    getFollowerThreads,
    getReplyThreads,
    getLikeThreads,
    getCommentThreads,
    getThreadByUser,
    getLikedThreads,
    getCommentedThreads,

    createComment,
    getComment,

    getLikePost,
    deleteThread
};