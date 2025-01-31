// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// MongoDB Post Schema
const postSchema = new mongoose.Schema({
    text: String,
    date: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching posts' });
    }
});

app.post('/api/posts', async (req, res) => {
    try {
        const post = new Post({ text: req.body.text });
        await post.save();
        io.emit('newPost', post);
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Error creating post' });
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        server.listen(process.env.PORT || 3000, () => {
            console.log(`Server running on port ${process.env.PORT || 3000}`);
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));