function parsePagination(query) {
    const rawPage = query.page ?? '1';
    const rawLimit = query.limit ?? '10';

    const page = Number(rawPage);
    const limit = Number(rawLimit);

    if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1) {
        return { error: 'page and limit must be positive integers' };
    }

    return { page, limit: Math.min(limit, 50) };
}

module.exports = { parsePagination };
