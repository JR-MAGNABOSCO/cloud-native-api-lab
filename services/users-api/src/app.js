const express = require('express');

const userRoutes = require('./routes/userRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

app.use(express.json());

app.use('/health', healthRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => {
    return res.status(404).json({
        error: 'Rota não encontrada',
    });
});

module.exports = app;
