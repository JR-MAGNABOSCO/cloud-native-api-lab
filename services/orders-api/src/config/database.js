const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

pool.on('error', (error) => {
    console.error(
        'Erro inesperado no pool de conexões do PostgreSQL:',
        error.message
    );
});

module.exports = pool;
