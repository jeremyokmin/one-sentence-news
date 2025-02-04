const fetch = require('node-fetch');

const newsText = process.argv.slice(2).join(" ");

if (!newsText) {
    console.error("Error: No news text provided.");
    process.exit(1);
}

fetch('http://localhost:3000/api/posts', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: newsText })
})
.then(response => response.json())
.then(data => console.log("News added:", data))
.catch(error => console.error("Error adding news:", error));
