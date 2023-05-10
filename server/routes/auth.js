const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/auth')
const User = require('../models/User')

router.post('/register', async (req, res) => {

  const { name, password } = req.body
  if (!name || !password)
    return res.status(400).json({ success: false, message: 'Thiếu tài khoản hoặc mật khẩu' })

  try {
    const existingAccount = await User.findOne({ name: name })
    if (existingAccount)
      return res.status(400).json({ success: false, message: 'Tài khoản đã tồn tại' })

    const hashedPassword = await argon2.hash(password)
    const newUser = new User({ name, password: hashedPassword })
    await newUser.save()

    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    )

    res.json({ success: true, message: 'Tạo tài khoản thành công', accessToken })

  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Kết nối mạng của bạn có thể có vấn đề' })
  }
})

router.post('/login', async (req, res) => {

  const { name, password } = req.body
  if (!name || !password)
    return res
      .status(400)
      .json({ success: false, message: 'Thiếu tài khoản hoặc mật khẩu' })

  try {

    const user = await User.findOne({ name: name })
    if (!user)
      return res.status(400).json({ success: false, message: 'Sai tên đăng nhập' })

    const passwordValid = await argon2.verify(user.password, password)
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, message: 'Mật khẩu chưa đúng' })

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    )

    res.json({ success: true, message: 'Đăng nhập thành công!!!', accessToken })

  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Kết nối mạng của bạn có thể có vấn đề' })

  }
})


module.exports = router