const pool = require('../config/database');

const findAll = async () => {
    const result = await pool.query(`
        SELECT
            o.id,
            o.user_id,
            u.name AS customer,
            o.total,
            o.status,
            o.created_at
        FROM orders o
        INNER JOIN users u ON u.id = o.user_id
        ORDER BY o.id
    `);

    return result.rows;
};

const findById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            o.id,
            o.user_id,
            u.name AS customer,
            o.total,
            o.status,
            o.created_at
        FROM orders o
        INNER JOIN users u ON u.id = o.user_id
        WHERE o.id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

const create = async (userId, total, status) => {
    const result = await pool.query(
        `
        INSERT INTO orders (user_id, total, status)
        VALUES ($1, $2, $3)
        RETURNING id, user_id, total, status, created_at
        `,
        [userId, total, status]
    );

    return result.rows[0];
};

const update = async (id, userId, total, status) => {
    const result = await pool.query(
        `
        UPDATE orders
        SET user_id = $1,
            total = $2,
            status = $3
        WHERE id = $4
        RETURNING id, user_id, total, status, created_at
        `,
        [userId, total, status, id]
    );

    return result.rows[0] || null;
};

const remove = async (id) => {
    const result = await pool.query(
        `
        DELETE FROM orders
        WHERE id = $1
        RETURNING id, user_id, total, status
        `,
        [id]
    );

    return result.rows[0] || null;
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
};
