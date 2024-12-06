// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const {MONGO_URI, PORT} = process.env

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
    cors: {
        origin: ["https://chat-mohd.vercel.app","http://localhost:3000"], // frontend URL
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI).then((res) => {
    console.log("DB connected host : " + mongoose.connection.host);
  }).catch(err => console.log(err))
  

    // server/index.js
io.on('connection', (socket) => {
    console.log("User connected:", socket.id);

    socket.on('sendMessage', (data) => {
        // Expecting data to include { name, message }
        io.emit('receiveMessage', data);
    });

    socket.on('disconnect', () => {
        console.log("User disconnected:", socket.id);
    });
});
 

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
