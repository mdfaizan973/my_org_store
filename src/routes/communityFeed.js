/*
======================================================
COMMUNITY FEED BACKEND
Node.js + Express + MongoDB (Mongoose)

Features
- Create Post
- Feed List
- Like / Dislike
- Comments
- Engagement counts

Relations stored using STRING ids
No authentication logic included
======================================================
*/

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())

/*
======================================================
DATABASE CONNECTION
======================================================
*/

/*
======================================================
POST SCHEMA
======================================================
Stores user posts in the feed
*/

const PostSchema = new mongoose.Schema({

  authorId: String,

  authorName: String,

  authorAvatar: String,

  content: {
    type: String,
    required: true
  },

  imageUrl: String,

  likes: [String],

  dislikes: [String],

  createdAt: {
    type: Date,
    default: Date.now
  }

})

const Post = mongoose.model("Post", PostSchema)


/*
======================================================
COMMENT SCHEMA
======================================================
Stores comments for each post
*/

const CommentSchema = new mongoose.Schema({

  postId: String,

  authorId: String,

  authorName: String,

  content: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

})

const Comment = mongoose.model("Comment", CommentSchema)



/*
======================================================
CREATE POST
POST /api/feed
======================================================
*/

app.post("/", async (req,res)=>{

  try{

    const {authorId,authorName,authorAvatar,content,imageUrl} = req.body

    const post = await Post.create({
      authorId,
      authorName,
      authorAvatar,
      content,
      imageUrl
    })

    res.json(post)

  }catch(err){

    res.status(500).json({error:err.message})

  }

})



/*
======================================================
GET FEED POSTS
GET /api/feed?page=&limit=
======================================================
*/

app.get("/", async (req,res)=>{

  try{

    const {page=1,limit=10} = req.query

    const posts = await Post.find()
      .sort({createdAt:-1})
      .skip((page-1)*limit)
      .limit(Number(limit))

    const result = []

    for(const post of posts){

      const commentCount = await Comment.countDocuments({
        postId:post._id.toString()
      })

      result.push({

        ...post.toObject(),

        likeCount: post.likes.length,

        dislikeCount: post.dislikes.length,

        commentCount

      })

    }

    res.json(result)

  }catch(err){

    res.status(500).json({error:err.message})

  }

})



/*
======================================================
DELETE POST
DELETE /api/feed/:id
======================================================
*/

app.delete("/:id", async (req,res)=>{

  await Post.findByIdAndDelete(req.params.id)

  await Comment.deleteMany({
    postId:req.params.id
  })

  res.json({message:"Post deleted"})

})



/*
======================================================
LIKE POST
POST /api/feed/:id/like
======================================================
*/

app.post("/:id/like", async (req,res)=>{

  const {userId} = req.body

  const post = await Post.findById(req.params.id)

  if(!post.likes.includes(userId))
  {
    post.likes.push(userId)

    post.dislikes = post.dislikes.filter(
      id => id !== userId
    )
  }

  await post.save()

  res.json({

    likeCount:post.likes.length,
    dislikeCount:post.dislikes.length

  })

})



/*
======================================================
DISLIKE POST
POST /api/feed/:id/dislike
======================================================
*/

app.post("/:id/dislike", async (req,res)=>{

  const {userId} = req.body

  const post = await Post.findById(req.params.id)

  if(!post.dislikes.includes(userId))
  {
    post.dislikes.push(userId)

    post.likes = post.likes.filter(
      id => id !== userId
    )
  }

  await post.save()

  res.json({

    likeCount:post.likes.length,
    dislikeCount:post.dislikes.length

  })

})



/*
======================================================
GET COMMENTS
GET /:postId/comments
======================================================
*/

app.get("/:postId/comments", async (req,res)=>{

  const comments = await Comment.find({
    postId:req.params.postId
  })
  .sort({createdAt:1})

  res.json(comments)

})



/*
======================================================
CREATE COMMENT
POST /api/feed/:postId/comments
======================================================
*/

app.post("/:postId/comments", async (req,res)=>{

  const {authorId,authorName,content} = req.body

  const comment = await Comment.create({

    postId:req.params.postId,

    authorId,

    authorName,

    content

  })

  res.json(comment)

})



/*
======================================================
DELETE COMMENT
DELETE /api/feed/:postId/comments/:id
======================================================
*/

app.delete("/:postId/comments/:id", async (req,res)=>{

  await Comment.findByIdAndDelete(req.params.id)

  res.json({message:"Comment deleted"})

})

