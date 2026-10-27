const { likePost, unlikePost } = require('../services/likes.service');
const { getPostById } = require('../services/posts.services');
const { getUserById } = require('../services/users.service');

const like = async (req, res) => {
    const postId = parseInt(req.params.id);
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const post = await getPostById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const user = await getUserById(parseInt(userId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    try {
        const newLike = await likePost(parseInt(userId), postId);
        res.status(201).json(newLike);
    } catch (e) {
        if (e.code === 'P2002') return res.status(409).json({ error: 'Already liked' });
        throw e;
    }
};

const unlike = async (req, res) => {
    const postId = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);

    try {
        await unlikePost(userId, postId);
        res.status(204).send();
    } catch (e) {
        if (e.code === 'P2025') return res.status(404).json({ error: 'Like not found' });
        throw e;
    }
};

module.exports = { like, unlike };
