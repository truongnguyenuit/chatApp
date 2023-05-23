require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const authRouter = require('./routes/auth')
const chatRouter = require('./routes/chat')
const messageRouter = require('./routes/message')
const { Server } = require("socket.io")

const cors = require('cors')

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@chatapp.hsa4hpv.mongodb.net/`,
    )
    console.log('MongoDB connected')
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}
connectDB()

const app = express()

app.use(cors({
  origin: "http://localhost:3000"
}))

app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)

const server = app.listen(5000, () => console.log(`server started on port 5000`))

// const io = new Server(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: "http://localhost:3000",
//   }
// })

const io = require("socket.io")(server, {
  pingTimeout: 60000000,
  cors: {
    origin: "http://localhost:3000",
  }
})

io.on("connection", (socket) => {
  console.log('connection to socket.io')

  // after join chat room, just go to a small room with roomID: userID
  socket.on("setup", (userData) => {
    console.log("join room setup", userData._id)
    socket.join(userData._id);
    socket.emit("connected")
  })

  // join big room with roomID: chatID
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user join room: ", room)
  })

  socket.on("new message", (newMessageReceived) => {
    console.log("gui mess",newMessageReceived)

    // received message to big room with roomID: chatID           
    var chat = newMessageReceived.chat

    if(!chat.users) return console.log("user is not defined");

    chat.users.forEach((user) => {
      if(user._id == newMessageReceived.sender._id) return;
      
      // send message to small room with roomID: userID
      // socket.in(user._id).emit("message received", newMessageReceived)
      socket.in(newMessageReceived.chat._id).emit("message received", newMessageReceived)
    })
  })

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
})