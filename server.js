
require('dotenv').config();

const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API route
app.get('/api/search', async (req, res) => {
  try {
    const searchTerm = req.query.search;
    const response = await axios.get(
        'https://www.googleapis.com/youtube/v3/search',
        {
            params: {
                part: 'snippet',
                maxResults: 10,
                q: searchTerm,
                key: process.env.YOUTUBE_API_KEY
            }
        }
    );
    res.json(response.data);
} catch (error) {
  console.error("FULL ERROR:", error.response?.data || error);
  res.status(500).json({ error: "Something went wrong" });
}

    //res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
