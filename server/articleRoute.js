// routes/articles.js
const express = require('express');
const router = express.Router();
const Article = require('./articleModel');

// ---- CACHING SETUP ------------------------------------
const apicache = require('apicache');
const cache = apicache.options({
    // don't cache errors or empty responses
    statusCodes: { exclude: [400, 401, 403, 404, 429, 500, 502, 503] },
    // include URL + query + params in keys automatically
}).middleware;

// 1 week TTL
const WEEK = '7 days';

// Force good browser/proxy caching too (immutable content during TTL)
router.use((req, res, next) => {
    // allow public caches; 7d TTL; let clients serve stale for 1d while revalidating
    res.set('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    next();
});

// Group name for easy invalidation after writes
const CACHE_GROUP = 'articles';

// Helper: clear all cached GETs for this router after mutations
function bustArticlesCache() {
    apicache.clear(CACHE_GROUP);
}

// -------------------------------------------------------

// GET all
router.get('/', cache(WEEK, null, { group: CACHE_GROUP }), async (req, res) => {
    const articles = await Article.find();
    res.json(articles);
});

// GET only published
router.get('/published', cache(WEEK, null, { group: CACHE_GROUP }), async (req, res) => {
    try {
        const publishedArticles = await Article.find({ canPublish: true });
        res.json(publishedArticles);
    } catch (error) {
        console.error('Error fetching published articles:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET by urlId (specific article page)
router.get('/:urlId', cache(WEEK, null, { group: CACHE_GROUP }), async (req, res) => {
    try {
        const article = await Article.findOne({ urlId: req.params.urlId });
        if (!article) return res.status(404).json({ message: 'Article not found' });
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Only the ID by urlId
router.get('/getArticleId/:urlId', cache(WEEK, null, { group: CACHE_GROUP }), async (req, res) => {
    try {
        const article = await Article.findOne({ urlId: req.params.urlId }).select('_id');
        if (article) res.json({ objectId: article._id });
        else res.status(404).json({ message: 'Article not found' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing your request' });
    }
});

// Search title (published only)
// Tip: shorter cache for searches if you prefer (e.g. '1 hour')
router.get('/searchTerm/:searchTerm', cache(WEEK, null, { group: CACHE_GROUP }), async (req, res) => {
    try {
        const searchTerm = req.params.searchTerm;
        const articles = await Article.find({
            title: { $regex: new RegExp(searchTerm, 'i') },
            canPublish: true
        });
        if (!articles.length) return res.status(404).json({ message: 'No articles found matching the search term' });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Filter by theme(s)
router.get('/themes/:themes', cache(WEEK, null, { group: CACHE_GROUP }), async (req, res) => {
    try {
        const themes = req.params.themes.split(',');
        const articles = await Article.find({ themes: { $in: themes }, canPublish: true });
        if (!articles.length) return res.status(404).json({ message: 'No articles found matching the specified themes' });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ---- MUTATIONS (bust cache after success) ---------------

// Add a new article
router.post('/', async (req, res) => {
    const article = new Article(req.body);
    try {
        await article.save();
        bustArticlesCache();
        res.json(article);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Edit an article
router.put('/:id', async (req, res) => {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    bustArticlesCache();
    res.json(article);
});

// Delete an article
router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    bustArticlesCache();
    res.json({ message: 'Article deleted' });
});

module.exports = router;