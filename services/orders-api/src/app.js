const express = require('express');

const orderRoutes = require('./routes/orderRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

app.use(express.json());

app.use('/health', healthRoutes);
app.use('/api/orders/health', healthRoutes);
app.use('/api/orders', orderRoutes);

app.use((req, res) => {
    return res.status(404).json({
        error: 'Rota não encontrada',
    });
});

module.exports = app;
