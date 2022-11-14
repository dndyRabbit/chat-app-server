require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io");

const app = express();

app.use(cors());
app.use(express.json());

//Routes
const user_route = require("./routes/user.route");
const message_route = require("./routes/message.route");

app.use("/api/auth", user_route);
app.use("/api", message_route);

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to mongodb");
  }
);

const server = app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "https://chat-app-rabbit.netlify.app",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });
});
