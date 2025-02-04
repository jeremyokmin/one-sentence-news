import './style.css'
import { io } from 'socket.io-client'
import { NewsManager } from './NewsManager'

const socket = io();
const newsManager = new NewsManager();

window.addEntry = () => {
    const text = prompt("Enter your news post:");
    newsManager.addEntry(text);
}