const { verify } = require('argon2')
const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const Post = require('../models/Post')

// @route GET Post api/post
// @desc Get User in Search
// @access Private
  
router.get('/search', verifyToken, async (req, res) => {
  const { title } = req.body
  try {
    const posts = await Post.find({ title: title }).populate('user', ['username','realname','email','img'])
    res.json({ success: true, posts })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Mạng của bạn có vấn đề' })
  }
})

// @route GET Post api/post
// @desc Get User Blog
// @access Private
  
router.get('/', verifyToken, async (req, res) => {

  try {
    const posts = await Post.find({ user: req.userId }).populate('user', ['username','realname','email','img'])
    res.json({ success: true, posts })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Mạng của bạn có vấn đề' })
  }
  
})
// @route GET Post api/post
// @desc Get all Blog
// @access Private
  
router.get('/getAllBlogs', verifyToken, async (req, res) => {

  try {
    const posts = await Post.find().populate('user', ['username','realname','email','img'])
    res.json({ success: true, posts })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Mạng của bạn có vấn đề' })
  }
  
})

// @route Post api/post
// @desc Create post
// @access Private

router.post('/', verifyToken, async (req, res) => {
  const { title, description,category, img } = req.body

  // Simple validation
  if (!title)
    return res.status(400).json({ success: false, message: 'Title Is Required' })
  try {
    const newPost = new Post({
      title: title,
      description: description,
      category: category,
      img: img,
      user: req.userId
    })

    await newPost.save()

    res.json({ success: true, message: 'Create Blog Successful!!!', post: newPost })

  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Mạng của bạn có vấn đề' })
  }
})

// @route Put api/post
// @desc Update post
// @access Private

router.put('/:id', verifyToken, async (req, res) => {
  const { title, description,category, img } = req.body
  // Simple validation
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: 'Title Is Required' })
  try {
    let updatedPost = {
      title: title,
      description: description,
      category: category,
      img: img
    }
    const postUpdateContidion = { _id: req.params.id, user: req.userId }

    updatedPost = await Post.findByIdAndUpdate(
      postUpdateContidion,
      updatedPost,
      { new: true }
      )
    // User not authorised to update post

    if (!updatedPost)  
    return res
      .status(401)
      .json({
        success: false,
        message: 'Post Not Found Of User Not Authorized'
      })

      res.json({ success: true, message: 'Excellent Progress!', post: updatedPost })

  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Mạng của bạn có vấn đề' })
  }
})

// @route DELETE api/post
// @desc DELETE post
// @access Private

router.delete('/:id', verifyToken, async(req, res) => {
  try {
    const postDeleteCondition = { _id: req.params.id, user: req.userId }
    const deletedPost = await Post.findOneAndDelete(postDeleteCondition)

    if (!deletedPost)
      return res.status(401).json({
        success: false,
        message: 'Post Not Found Or User Not Authorised'
      })

      res.json({success: true, message: "Delete Blog Succesful!!!"})
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Mạng của bạn có vấn đề' })

  }
})

module.exports = router