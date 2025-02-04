require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function addNewsEntry(text) {
    try {
        await client.connect();
        const database = client.db("news");
        const posts = database.collection("posts");
        
        const post = {
            text: text,
            date: new Date()
        };
        
        await posts.insertOne(post);
        console.log("News entry added successfully!");
        
        // If running as server, emit to connected clients
        if (io) {
            io.emit('newPost', post);
        }
        
    } catch (error) {
        console.error("Error adding news entry:", error);
    } finally {
        if (process.argv[2] === '--add') {
            await client.close();
            process.exit();
        }
    }
}

// Check if running as command line tool
if (process.argv[2] === '--add') {
    const newsText = process.argv[3];
    if (!newsText) {
        console.log("Please provide a news message. Usage: node server.js --add 'Your news here'");
        process.exit(1);
    }
    addNewsEntry(newsText);
} else {
    // Regular server setup
    app.use(express.json());
    app.use(express.static('public'));

    app.get('/api/posts', async (req, res) => {
        try {
            await client.connect();
            const database = client.db("news");
            const posts = database.collection("posts");
            const allPosts = await posts.find().sort({ date: -1 }).toArray();
            res.json(allPosts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post('/api/posts', async (req, res) => {
        try {
            const text = req.body.text;
            await addNewsEntry(text);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}