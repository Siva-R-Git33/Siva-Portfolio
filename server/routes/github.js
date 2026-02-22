const express = require('express');
const NodeCache = require('node-cache');

const router = express.Router();
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

// GET /api/github/repos - Public
router.get('/repos', async (req, res) => {
    try {
        const cacheKey = 'github_repos';
        const cached = cache.get(cacheKey);

        if (cached) {
            return res.json(cached);
        }

        const username = process.env.GITHUB_USERNAME || 'Siva-R-Git33';
        const response = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=20&type=owner`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Siva-Portfolio-App',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const repos = await response.json();
        const formatted = repos
            .filter((repo) => !repo.fork)
            .map((repo) => ({
                id: repo.id,
                name: repo.name,
                description: repo.description,
                language: repo.language,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                url: repo.html_url,
                homepage: repo.homepage,
                updatedAt: repo.updated_at,
                topics: repo.topics,
            }));

        cache.set(cacheKey, formatted);
        res.json(formatted);
    } catch (error) {
        console.error('GitHub API error:', error.message);
        res.status(500).json({ message: 'Failed to fetch GitHub repos.' });
    }
});

module.exports = router;
