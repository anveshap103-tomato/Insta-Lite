const Prisma = require('../src/db');
const { users, posts, likes } = require('./seed-data');

async function seed() {
    await Prisma.like.deleteMany();
    await Prisma.post.deleteMany();
    await Prisma.user.deleteMany();

    const createdUsers = await Prisma.user.createManyAndReturn({ data: users });

    const userMap = {};
    for (const u of createdUsers) userMap[u.username] = u.id;

    const createdPosts = await Prisma.post.createManyAndReturn({
        data: posts.map(({ author, ...rest }) => ({ ...rest, authorId: userMap[author] }))
    });

    const postMap = {};
    for (const p of createdPosts) {
        const key = p.imageUrl.split('/')[4];
        postMap[key] = p.id;
    }

    const createdLikes = await Prisma.like.createManyAndReturn({
        data: likes.map(({ user, post }) => ({ userId: userMap[user], postId: postMap[post] }))
    });

    console.log(`🌱 Seeded ${createdUsers.length} users, ${createdPosts.length} posts and ${createdLikes.length} likes`);
}

seed()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => Prisma.$disconnect());
