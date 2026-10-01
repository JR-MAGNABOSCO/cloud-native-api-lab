const pool = require('../config/database');

const findAll = async () => {
    const result = await pool.query(`
        SELECT id, name, email, created_at
        FROM users
        ORDER BY id
    `);

    return result.rows;
};

const findById = async (id) => {
    const result = await pool.query(
        `
        SELECT id, name, email, created_at
        FROM users
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

const create = async (name, email) => {
    const result = await pool.query(
        `
        INSERT INTO users (name, email)
        VALUES ($1, $2)
        RETURNING id, name, email, created_at
        `,
        [name, email]
    );

    return result.rows[0];
};

const update = async (id, name, email) => {
    const result = await pool.query(
        `
        UPDATE users
        SET name = $1,
            email = $2
        WHERE id = $3
        RETURNING id, name, email, created_at
        `,
        [name, email, id]
    );

    return result.rows[0] || null;
};

const remove = async (id) => {
    const result = await pool.query(
        `
        DELETE FROM users
        WHERE id = $1
        RETURNING id, name, email
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
