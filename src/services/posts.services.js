const Prisma = require("../db");

const authorSelect = { select: { id: true, username: true, fullname: true } };

async function createPost(data) {
    return Prisma.post.create({
        data,
        include: { author: authorSelect, _count: { select: { likes: true } } }
    });
}

async function listPosts({ page, limit, sortBy, order, location, search, from, to }) {
    const where = {};

    if (location) where.location = { equals: location, mode: 'insensitive' };
    if (search) where.caption = { contains: search, mode: 'insensitive' };
    if (from || to) {
        where.createdAt = {};
        if (from) where.createdAt.gte = new Date(from);
        if (to) where.createdAt.lt = new Date(to);
    }

    const orderBy = sortBy === 'likes'
        ? [{ likes: { _count: order } }, { createdAt: 'desc' }]
        : { [sortBy]: order };

    const [posts, total] = await Prisma.$transaction([
        Prisma.post.findMany({
            where,
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
            include: { author: authorSelect, _count: { select: { likes: true } } }
        }),
        Prisma.post.count({ where })
    ]);

    return { data: posts, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

async function getPostById(id) {
    return Prisma.post.findUnique({
        where: { id },
        include: { author: authorSelect, _count: { select: { likes: true } } }
    });
}

async function updatePost(id, data) {
    return Prisma.post.update({
        where: { id },
        data,
        include: { author: authorSelect, _count: { select: { likes: true } } }
    });
}

async function deletePost(id) {
    await Prisma.post.delete({ where: { id } });
}

async function getPostLikes(id) {
    const likes = await Prisma.like.findMany({
        where: { postId: id },
        orderBy: { user: { username: 'asc' } },
        select: { user: authorSelect }
    });
    return likes.map(l => l.user);
}

async function getLikedPosts(userId, { page, limit }) {
    const where = { likes: { some: { userId } } };
    const [posts, total] = await Prisma.$transaction([
        Prisma.post.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: { author: authorSelect, _count: { select: { likes: true } } }
        }),
        Prisma.post.count({ where })
    ]);
    return { data: posts, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

module.exports = { createPost, listPosts, getPostById, updatePost, deletePost, getPostLikes, getLikedPosts };
