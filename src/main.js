import { io } from 'socket.io-client';
import { NewsManager } from './NewsManager.js';

const socket = io();
const newsManager = new NewsManager();

socket.on('newPost', (post) => {
    newsManager.addEntryToDisplay(post);
});
