const User = require('../models/User')
const Chat = require('../models/Chat')
const express = require('express')
const verifyToken = require('../middleware/auth')
const router = express.Router()

router.post('/', verifyToken, async (req, res) => {

  console.log("hehee", req.user._id)
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        // "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
})

router.get('/', verifyToken, async (req, res) => {
  try {
    await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ createdAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name pic email"
        })
        return res.status(200).json({ chats: result })
      })
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
})

router.post('/group', verifyToken, async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ message: "please fill all of field" })
  }

  var users = JSON.parse(req.body.users)

  users.push(req.user)

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user
    })

    let fullGroupChat = await Chat.find({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")

    return res.status(200).json(fullGroupChat)
  } catch (error) {
    res.status(400);
    throw new Error(error.message)
  }
})

router.put('/rename', verifyToken, async (req, res) => {
  const { chatId, chatName } = req.body

  try {
    const updateChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName
      },
      {
        new: true
      })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")

    if (!updateChat) {
      res.status(400);
      throw new Error("Chat not found")
    }

    res.status(200).json(updateChat)

  } catch (error) {
    res.status(500).json(error.message)
  }
})

router.put('/groupAdd', verifyToken, async (req, res) => {
  const { chatId, userId } = req.body

  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId }
      },
      {
        new: true
      })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")

    if (!added) {
      res.status(400);
      throw new Error("Chat not found")
    }

    res.status(200).json(added)

  } catch (error) {
    res.status(500).json(error.message)
  }
})

router.put('/groupRemove', verifyToken, async (req, res) => {
  const { chatId, userId } = req.body

  try {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId }
      },
      {
        new: true
      })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")

    if (!removed) {
      res.status(400);
      throw new Error("Chat not found")
    }

    res.status(200).json(removed)

  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router