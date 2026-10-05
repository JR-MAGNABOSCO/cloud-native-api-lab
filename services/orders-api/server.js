const app = require('./src/app');

const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'orders-api';
const APP_ENV = process.env.APP_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

app.listen(PORT, '0.0.0.0', () => {
    console.log(`${APP_NAME} running on port ${PORT}`);
    console.log(`Environment: ${APP_ENV}`);
    console.log(`Log level: ${LOG_LEVEL}`);
});