const Prisma = require("../db");

async function createUser(data) {
    return Prisma.user.create({ data });
}

async function listUsers({ page, limit, sortBy, order, isPrivate, search, hasPosts }) {
    const where = {};

    if (isPrivate !== undefined) where.isPrivate = isPrivate;

    if (search) {
        where.OR = [
            { username: { contains: search, mode: 'insensitive' } },
            { fullname: { contains: search, mode: 'insensitive' } }
        ];
    }

    if (hasPosts !== undefined) {
        where.posts = hasPosts ? { some: {} } : { none: {} };
    }

    const [users, total] = await Prisma.$transaction([
        Prisma.user.findMany({
            where,
            orderBy: { [sortBy]: order },
            skip: (page - 1) * limit,
            take: limit
        }),
        Prisma.user.count({ where })
    ]);

    return { data: users, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

async function getUserById(id) {
    return Prisma.user.findUnique({
        where: { id },
        include: { _count: { select: { posts: true, likes: true } } }
    });
}

async function updateUser(id, data) {
    return Prisma.user.update({ where: { id }, data });
}

async function deleteUser(id) {
    await Prisma.user.delete({ where: { id } });
}

async function getUNique(email, username) {
    return Prisma.user.findFirst({
        where: { OR: [{ email }, { username }] }
    });
}

async function getUserPosts(id, { page, limit }) {
    const where = { authorId: id };
    const [posts, total] = await Prisma.$transaction([
        Prisma.post.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: { _count: { select: { likes: true } } }
        }),
        Prisma.post.count({ where })
    ]);
    return { data: posts, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

module.exports = { createUser, listUsers, getUserById, updateUser, deleteUser, getUNique, getUserPosts };
