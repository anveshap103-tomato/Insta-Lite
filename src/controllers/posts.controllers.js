const {
    createPost,
    listPosts,
    getPostById,
    updatePost,
    deletePost
} = require('../services/posts.services');

const create = async (req, res) => {
    const { imageUrl, caption, location } = req.body;
    if (!imageUrl) {
        res.status(400).json({ "error": "imageUrl is required" });
        return;
    }
    const new_post = await createPost({ imageUrl, ...(caption !== undefined && { caption }), ...(location !== undefined && { location }) });
    res.status(201).json(new_post);
};

const list = async (req, res) => {
    const all_posts = await listPosts();
    res.status(200).json(all_posts);
};

const getOne = async (req, res) => {
    const id = parseInt(req.params.id);
    const post = await getPostById(id);
    if (post) {
        res.status(200).json(post);
    } else {
        res.status(404).json({ "error": "Post not found" });
    }
};

const update = async (req, res) => {
    const id = parseInt(req.params.id);
    const { caption, location } = req.body;
    const post = await getPostById(id);
    if (!post) {
        res.status(404).json({ "error": "Post not found" });
        return;
    }
    const updated_post = await updatePost(id, {
        ...(caption !== undefined && { caption }),
        ...(location !== undefined && { location })
    });
    res.status(200).json(updated_post);
};

const remove = async (req, res) => {
    const id = parseInt(req.params.id);
    const post = await getPostById(id);
    if (!post) {
        res.status(404).json({ "error": "Post not found" });
        return;
    }
    await deletePost(id);
    res.status(204).send();
};

module.exports = {
    create,
    list,
    getOne,
    update,
    remove
};
