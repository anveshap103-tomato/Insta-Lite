const { createUser, listUsers, getUserById, updateUser, deleteUser, getUNique, getUserPosts } = require('../services/users.service');
const { parsePagination } = require('../utils/pagination');

const ALLOWED_SORT = ['createdAt', 'username', 'fullname'];

const create = async (req, res) => {
    const { username, email, fullname, bio } = req.body;
    if (!username || !email || !fullname) {
        return res.status(400).json({ error: 'username, email and fullname are required' });
    }
    const already_exist = await getUNique(email, username);
    if (already_exist) return res.status(409).json({ error: 'username or email already taken' });
    const new_user = await createUser({ username, email, fullname, bio });
    res.status(201).json(new_user);
};

const list = async (req, res) => {
    const pagination = parsePagination(req.query);
    if (pagination.error) return res.status(400).json({ error: pagination.error });

    const sortBy = req.query.sortBy ?? 'createdAt';
    const order = req.query.order ?? 'desc';

    if (!ALLOWED_SORT.includes(sortBy)) {
        return res.status(400).json({ error: 'sortBy must be one of: createdAt, username, fullname' });
    }
    if (!['asc', 'desc'].includes(order)) {
        return res.status(400).json({ error: 'order must be asc or desc' });
    }

    let isPrivate;
    if (req.query.isPrivate !== undefined) {
        if (req.query.isPrivate === 'true') isPrivate = true;
        else if (req.query.isPrivate === 'false') isPrivate = false;
        else return res.status(400).json({ error: 'isPrivate must be true or false' });
    }

    let hasPosts;
    if (req.query.hasPosts !== undefined) {
        if (req.query.hasPosts === 'true') hasPosts = true;
        else if (req.query.hasPosts === 'false') hasPosts = false;
        else return res.status(400).json({ error: 'hasPosts must be true or false' });
    }

    const result = await listUsers({ ...pagination, sortBy, order, isPrivate, search: req.query.search, hasPosts });
    res.status(200).json(result);
};

const getOne = async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
};

const update = async (req, res) => {
    const id = parseInt(req.params.id);
    const { fullname, bio, isPrivate } = req.body;
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const updated_user = await updateUser(id, {
        ...(fullname !== undefined && { fullname }),
        ...(bio !== undefined && { bio }),
        ...(isPrivate !== undefined && { isPrivate })
    });
    res.status(200).json(updated_user);
};

const remove = async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await deleteUser(id);
    res.status(204).send();
};

const getUserPostsHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const pagination = parsePagination(req.query);
    if (pagination.error) return res.status(400).json({ error: pagination.error });
    const result = await getUserPosts(id, pagination);
    res.status(200).json(result);
};

module.exports = { create, list, getOne, update, remove, getUserPostsHandler };
