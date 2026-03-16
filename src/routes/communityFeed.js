const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const PostSchema = new mongoose.Schema({
  authorId: { type: String },
  authorName: { type: String },
  authorAvatar: { type: String },
  content: { type: String, required: true },
  imageUrl: { type: String, default: null },
  likes: { type: [String], default: [] },
  dislikes: { type: [String], default: [] }
}, { timestamps: true });

const Post = mongoose.model("CommunityPost", PostSchema);

const CommentSchema = new mongoose.Schema({
  postId: { type: String },
  authorId: { type: String },
  authorName: { type: String },
  content: { type: String, required: true }
}, { timestamps: true });

const Comment = mongoose.model("CommunityComment", CommentSchema);


/* Create new community post with optional image */
router.post("/", async (req,res)=>{
  try{
    const { authorId, authorName, authorAvatar, content, imageUrl } = req.body;

    const post = new Post({
      authorId,
      authorName,
      authorAvatar,
      content,
      imageUrl
    });

    const savedPost = await post.save();

    res.status(201).json(savedPost);

  }catch(err){
    res.status(400).json({ error: err.message });
  }
});


/* Get paginated feed posts sorted by newest */
router.get("/", async (req,res)=>{
  try{

    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const result = [];

    for(const post of posts){

      const commentCount = await Comment.countDocuments({
        postId: post._id.toString()
      });

      result.push({
        ...post.toObject(),
        likeCount: post.likes.length,
        dislikeCount: post.dislikes.length,
        commentCount
      });

    }

    res.status(200).json(result);

  }catch(err){
    res.status(500).json({ error: err.message });
  }
});


/* Delete post and remove all related comments */
router.delete("/:id", async (req,res)=>{
  try{

    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if(!deletedPost)
      return res.status(404).json({ message: "Post not found" });

    await Comment.deleteMany({ postId: req.params.id });

    res.status(200).json({ message: "Post deleted successfully" });

  }catch(err){
    res.status(500).json({ error: err.message });
  }
});


/* Like post and remove dislike if exists */
router.post("/:id/like", async (req,res)=>{
  try{

    const { userId } = req.body;

    const post = await Post.findById(req.params.id);

    if(!post)
      return res.status(404).json({ message: "Post not found" });

    if(!post.likes.includes(userId)){
      post.likes.push(userId);
      post.dislikes = post.dislikes.filter(id => id !== userId);
    }

    await post.save();

    res.status(200).json({
      likeCount: post.likes.length,
      dislikeCount: post.dislikes.length
    });

  }catch(err){
    res.status(500).json({ error: err.message });
  }
});


/* Dislike post and remove like if exists */
router.post("/:id/dislike", async (req,res)=>{
  try{

    const { userId } = req.body;

    const post = await Post.findById(req.params.id);

    if(!post)
      return res.status(404).json({ message: "Post not found" });

    if(!post.dislikes.includes(userId)){
      post.dislikes.push(userId);
      post.likes = post.likes.filter(id => id !== userId);
    }

    await post.save();

    res.status(200).json({
      likeCount: post.likes.length,
      dislikeCount: post.dislikes.length
    });

  }catch(err){
    res.status(500).json({ error: err.message });
  }
});


/* Get all comments for a specific post */
router.get("/:postId/comments", async (req,res)=>{
  try{

    const comments = await Comment.find({
      postId: req.params.postId
    }).sort({ createdAt: 1 });

    res.status(200).json(comments);

  }catch(err){
    res.status(500).json({ error: err.message });
  }
});


/* Create new comment under specific post */
router.post("/:postId/comments", async (req,res)=>{
  try{

    const { authorId, authorName, content } = req.body;

    const comment = new Comment({
      postId: req.params.postId,
      authorId,
      authorName,
      content
    });

    const savedComment = await comment.save();

    res.status(201).json(savedComment);

  }catch(err){
    res.status(400).json({ error: err.message });
  }
});


/* Delete specific comment from a post */
router.delete("/:postId/comments/:id", async (req,res)=>{
  try{

    const deletedComment = await Comment.findByIdAndDelete(req.params.id);

    if(!deletedComment)
      return res.status(404).json({ message: "Comment not found" });

    res.status(200).json({ message: "Comment deleted successfully" });

  }catch(err){
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
