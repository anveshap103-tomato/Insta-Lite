const Prisma = require("../db");

async function createUser(data){
    const new_user = await Prisma.user.create({
          data: data
    })
    return new_user 
};

async function listUsers() {
    const all_users = await Prisma.user.findMany();
    return all_users
}

async function getUserById(id){
    const user = await Prisma.user.findUnique({
        where: { id: id }
    })
    return user 
}

async function updateUser(id, data){
    const updated_user = await Prisma.user.update({
        where: { id: id },
        data: data
    });

    return updated_user;
}

async function deleteUser(id) {
    await Prisma.user.delete({
        where: { id: id }
    });
}

async function getUNique(email, username){
    const already_exist = await Prisma.user.findUnique({
        where: { email: email , username: username},
      });
    return already_exist
}

module.exports = {
    createUser,
    listUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUNique
};