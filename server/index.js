require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const authRouter = require('./routes/auth')
const chatRouter = require('./routes/chat')
const messageRouter = require('./routes/message')
const path = require("path")


const cors = require('cors')

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const connection = await mongoose.connect(
      `mongodb+srv://vrttankzz:0918972561@chatapp.hsa4hpv.mongodb.net`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: true,
    })
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit()
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

//-----------------deployment----------------------

const __dirname1 = path.resolve()
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  })
} else {
  app.get("/", (req, res) => {
    res.send("API is running succesfully")
  })
}

//-----------------deployment---------------------

const server = app.listen(5000, () => console.log(`server started on port 5000`))

const io = require("socket.io")(server, {
  pingTimeout: 600000000,
  cors: {
    origin: "http://localhost:3000",
  }
})

io.on("connection", (socket) => {
  console.log('connection to socket.io')

  // after join chat room, just go to a small room with roomID: userID
  socket.on("setup", (userData) => {
    console.log("join chat room new", userData._id)
    socket.join(userData._id);
    socket.emit("connected")
  })

  socket.on("have new connect", (room) => {
    console.log("have mssss", room)
    socket.in(room).emit("have new connect")
  })

  // join big room with roomID: chatID
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user join room: ", room)
  })

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {

    // received message to big room with roomID: chatID           
    var chat = newMessageReceived.chat
    if (!chat.users) return console.log("user is not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      // send message to big room with roomID: chatID
      socket.in(newMessageReceived.chat._id).emit("message received", newMessageReceived)
    })
  })

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
})

