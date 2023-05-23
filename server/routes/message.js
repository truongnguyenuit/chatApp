const express = require('express')
const verifyToken = require('../middleware/auth')
const router = express.Router()
const Message = require('../models/Message')
const Chat = require('../models/Chat')
const User = require('../models/User')

router.post('/', verifyToken, async (req, res) => {
  const { content, chatId } = req.body

  if (!content || !chatId) {
    return res.status(400).json({ error: 'Missing info' })
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  }

  try {
    var message = await Message.create(newMessage)

    message = await message.populate("sender", "name pic")
    message = await message.populate("chat")
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email"
    })

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    })

    return res.status(200).json(message)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:chatId', verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat")

    return res.status(200).json(messages)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router