const Prisma = require("../db");

async function createPost(data) {
    const new_post = await Prisma.post.create({ data: data });
    return new_post;
}

async function listPosts() {
    const all_posts = await Prisma.post.findMany();
    return all_posts;
}

async function getPostById(id) {
    const post = await Prisma.post.findUnique({ where: { id: id } });
    return post;
}

async function updatePost(id, data) {
    const updated_post = await Prisma.post.update({ where: { id: id }, data: data });
    return updated_post;
}

async function deletePost(id) {
    await Prisma.post.delete({ where: { id: id } });
}

module.exports = {
    createPost,
    listPosts,
    getPostById,
    updatePost,
    deletePost
};
