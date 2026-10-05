const orderRepository = require('../repositories/orderRepository');

const allowedStatuses = [
    'pending',
    'paid',
    'shipped',
];

const getAllOrders = async () => {
    return orderRepository.findAll();
};

const getOrderById = async (id) => {
    return orderRepository.findById(id);
};

const createOrder = async (data) => {
    const userId = Number(data.user_id);
    const total = Number(data.total);
    const status = data.status?.trim().toLowerCase();

    if (!Number.isInteger(userId) || userId <= 0) {
        const error = new Error('Usuário inválido');
        error.statusCode = 400;
        throw error;
    }

    if (!Number.isFinite(total) || total <= 0) {
        const error = new Error('O valor total deve ser maior que zero');
        error.statusCode = 400;
        throw error;
    }

    if (!allowedStatuses.includes(status)) {
        const error = new Error('Status do pedido inválido');
        error.statusCode = 400;
        throw error;
    }

    return orderRepository.create(userId, total, status);
};

const updateOrder = async (id, data) => {
    const userId = Number(data.user_id);
    const total = Number(data.total);
    const status = data.status?.trim().toLowerCase();

    if (!Number.isInteger(userId) || userId <= 0) {
        const error = new Error('Usuário inválido');
        error.statusCode = 400;
        throw error;
    }

    if (!Number.isFinite(total) || total <= 0) {
        const error = new Error('O valor total deve ser maior que zero');
        error.statusCode = 400;
        throw error;
    }

    if (!allowedStatuses.includes(status)) {
        const error = new Error('Status do pedido inválido');
        error.statusCode = 400;
        throw error;
    }

    return orderRepository.update(id, userId, total, status);
};

const deleteOrder = async (id) => {
    return orderRepository.remove(id);
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
};
