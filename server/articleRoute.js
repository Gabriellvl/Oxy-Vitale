const express = require('express');
const router = express.Router();
const Article = require('./articleModel');

router.get('/', async (req, res) => {
    const articles = await Article.find();
    res.json(articles);
});

router.get('/published', async (req, res) => {
    try {
        // Fetch only the articles where the 'published' field is true
        const publishedArticles = await Article.find({ canPublish: true });
        res.json(publishedArticles);
    } catch (error) {
        console.error('Error fetching published articles:', error);
        res.status(500).json({ error: error.message });
    }
});


router.get('/:urlId', async (req, res) => {
    try {
        const article = await Article.findOne({ urlId: req.params.urlId });
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/getArticleId/:urlId', async (req, res) => {
    try {
        const urlId = req.params.urlId;
        const article = await Article.findOne({ urlId: urlId }).select('_id');

        if (article) {
            res.json({ objectId: article._id }); // Sending the Mongoose Object ID as a response
        } else {
            res.status(404).json({ message: 'Article not found' }); // No article found with the provided urlId
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing your request' });
    }
});

router.get('/searchTerm/:searchTerm', async (req, res) => {
    try {
        const searchTerm = req.params.searchTerm;
        const articles = await Article.find({
            title: { $regex: new RegExp(searchTerm, 'i') },
            canPublish: true
        });

        if (articles.length === 0) {
            return res.status(404).json({ message: 'No articles found matching the search term' });
        }

        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/themes/:themes', async (req, res) => {
    try {
        const themes = req.params.themes.split(',');
        const articles = await Article.find({
            themes: { $in: themes },
            canPublish: true
        });

        if (articles.length === 0) {
            return res.status(404).json({ message: 'No articles found matching the specified themes' });
        }

        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Add a new article
router.post('/', async (req, res) => {
    const article = new Article(req.body);
    try {
        await article.save();
        res.json(article);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Edit an article
router.put('/:id', async (req, res) => {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(article);
});

// Delete an article
router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article deleted' });
});


module.exports = router;
