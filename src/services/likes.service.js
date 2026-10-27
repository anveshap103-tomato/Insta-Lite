const Prisma = require("../db");

async function likePost(userId, postId) {
    return Prisma.like.create({ data: { userId, postId } });
}

async function unlikePost(userId, postId) {
    return Prisma.like.delete({ where: { userId_postId: { userId, postId } } });
}

module.exports = { likePost, unlikePost };
