const express = require("express");
const http = require("http");
const { Server } = require("socket.io");


const app = express();
const messageHistory = [];

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 3000;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  console.log("history++", messageHistory)

  // Send last 20 messages
  socket.emit("chatHistory", messageHistory);


  // Listen for messages
  socket.on("sendMessage", (data) => {
    console.log("Received message:", data);
    const message = {
      username: data.username,
      text: data.text,
      timestamp: new Date().toISOString(),
    };

    messageHistory.push(message);
    if (messageHistory.length > 20) messageHistory.shift();
    console.log("Sending message:", message);
     messageHistory.push(message);

     console.log(messageHistory,'new old')
    io.emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

console.log(messageHistory,"message history")


server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

