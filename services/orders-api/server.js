const http = require('http');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'orders-api';
const APP_ENV = process.env.APP_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

pool.on('error', (error) => {
    console.error('Unexpected PostgreSQL pool error:', error.message);
});

const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET' && req.url === '/health/live') {
        res.writeHead(200);

        return res.end(JSON.stringify({
            service: APP_NAME,
            status: 'alive',
        }));
    }

    if (req.method === 'GET' && req.url === '/health/ready') {
        try {
            await pool.query('SELECT 1');

            res.writeHead(200);

            return res.end(JSON.stringify({
                service: APP_NAME,
                status: 'ready',
                database: 'connected',
            }));
        } catch (error) {
            console.error('Readiness check failed:', error.message);

            res.writeHead(503);

            return res.end(JSON.stringify({
                service: APP_NAME,
                status: 'not ready',
                database: 'unavailable',
            }));
        }
    }

    if (req.method === 'GET' && req.url === '/api/orders') {
        try {
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

            res.writeHead(200);

            return res.end(JSON.stringify({
                service: APP_NAME,
                data: result.rows,
            }));
        } catch (error) {
            console.error('Error fetching orders:', error.message);

            res.writeHead(500);

            return res.end(JSON.stringify({
                error: 'Internal Server Error',
            }));
        }
    }

    res.writeHead(404);

    return res.end(JSON.stringify({
        error: 'Not Found',
    }));
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`${APP_NAME} running on port ${PORT}`);
    console.log(`Environment: ${APP_ENV}`);
    console.log(`Log level: ${LOG_LEVEL}`);
});