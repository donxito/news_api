const express = require('express');
const axios = require('axios');
const morgan = require('morgan');
const path = require('path');

const PORT = 3000;
const app = express();

app.config = {
    API_KEY: process.env.API_KEY
}



// Load environment variables from .env file
require('dotenv').config();


// Middleware
app.use(morgan('dev'));
app.use(express.static("public"));

// View Engine

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes

// GET /home 
app.get("/", async (req, res, next) => {
    res.render("index.ejs", { content: "Welcome to the News API" });
});


// GET /sources
app.get("/sources", async (req, res, next) => {
    try {
        // Fetch the news sources from the API
        const response = await axios.get(`https://newsapi.org/v2/top-headlines/sources?apiKey=${process.env.API_KEY}`);


        // Extract the content from the response
        const sources = response.data.sources;
        
        // Render the EJS template with the news
        res.render("sources", { sources });

    } catch (error) {
        console.log("Error fetching news:", error);
        res.status(500).send("Error fetching news");
    }
});

// GET  /sources/:sourceId
app.get("/sources/:sourceId", async (req,res,next) => {
    try {
        // Fetch the news articles from the API using the source Id
        const sourceId = req.params.sourceId;

        const response  = await axios.get(`https://newsapi.org/v2/everything?q=${sourceId}&apiKey=${process.env.API_KEY}`);
        const articles = response.data.articles;
        res.render("news", { articles, sourceId });

        console.log(sourceId)
     
    } catch (error) {
        console.log(error, "Error fetching articles");
        res.status(500).send("Error fetching articles");
    }
})


// GET /titles
app.get("/titles", async (req,res,next) => {
    try {
        const title = req.query.title; // Retrieve the title from the query parameters

        // Fetch the news articles from the API using the title
        const response = await axios.get(`https://newsapi.org/v2/everything?qInTitle=${title}&apiKey=${process.env.API_KEY}`);

        // Extract the content from the response
        const articles = response.data.articles;
       
        // Render the EJS template with the news
        res.render("titles", { articles });
        console.log(articles);

    } catch (error) {
        console.log(error, "Error fetching articles");
        res.status(500).send("Error fetching articles");
    }
});






// Listening
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
