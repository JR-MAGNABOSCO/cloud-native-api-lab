const pool = require('../config/database');

const live = (req, res) => {
    return res.status(200).json({
        service: process.env.APP_NAME || 'orders-api',
        status: 'alive',
    });
};

const ready = async (req, res) => {
    try {
        await pool.query('SELECT 1');

        return res.status(200).json({
            service: process.env.APP_NAME || 'orders-api',
            status: 'ready',
            database: 'connected',
        });
    } catch (error) {
        console.error(
            'Falha na verificação de prontidão:',
            error.message
        );

        return res.status(503).json({
            service: process.env.APP_NAME || 'orders-api',
            status: 'not ready',
            database: 'unavailable',
        });
    }
};

module.exports = {
    live,
    ready,
};
