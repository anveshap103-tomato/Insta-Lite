const { createPost, listPosts, getPostById, updatePost, deletePost, getPostLikes, getLikedPosts } = require('../services/posts.services');
const { getUserById } = require('../services/users.service');
const { parsePagination } = require('../utils/pagination');

const ALLOWED_SORT = ['createdAt', 'updatedAt', 'likes'];

const create = async (req, res) => {
    const { imageUrl, authorId, caption, location } = req.body;
    if (!imageUrl || !authorId) {
        return res.status(400).json({ error: 'imageUrl and authorId are required' });
    }
    const author = await getUserById(parseInt(authorId));
    if (!author) return res.status(404).json({ error: 'User not found' });
    const new_post = await createPost({ imageUrl, authorId: parseInt(authorId), caption, location });
    res.status(201).json(new_post);
};

const list = async (req, res) => {
    const pagination = parsePagination(req.query);
    if (pagination.error) return res.status(400).json({ error: pagination.error });

    const sortBy = req.query.sortBy ?? 'createdAt';
    const order = req.query.order ?? 'desc';

    if (!ALLOWED_SORT.includes(sortBy)) {
        return res.status(400).json({ error: 'sortBy must be one of: createdAt, updatedAt, likes' });
    }
    if (!['asc', 'desc'].includes(order)) {
        return res.status(400).json({ error: 'order must be asc or desc' });
    }

    const { from, to, location, search } = req.query;
    if (from && isNaN(Date.parse(from))) return res.status(400).json({ error: 'from and to must be valid dates' });
    if (to && isNaN(Date.parse(to))) return res.status(400).json({ error: 'from and to must be valid dates' });

    const result = await listPosts({ ...pagination, sortBy, order, location, search, from, to });
    res.status(200).json(result);
};

const getOne = async (req, res) => {
    const id = parseInt(req.params.id);
    const post = await getPostById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json(post);
};

const update = async (req, res) => {
    const id = parseInt(req.params.id);
    const { caption, location } = req.body;
    const post = await getPostById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const updated_post = await updatePost(id, {
        ...(caption !== undefined && { caption }),
        ...(location !== undefined && { location })
    });
    res.status(200).json(updated_post);
};

const remove = async (req, res) => {
    const id = parseInt(req.params.id);
    const post = await getPostById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    await deletePost(id);
    res.status(204).send();
};

const getLikedPostsHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const pagination = parsePagination(req.query);
    if (pagination.error) return res.status(400).json({ error: pagination.error });
    const result = await getLikedPosts(id, pagination);
    res.status(200).json(result);
};

const getPostLikesHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const post = await getPostById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const likers = await getPostLikes(id);
    res.status(200).json(likers);
};

module.exports = { create, list, getOne, update, remove, getPostLikesHandler, getLikedPostsHandler };
