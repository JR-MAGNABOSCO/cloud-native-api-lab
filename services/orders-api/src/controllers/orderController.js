const orderService = require('../services/orderService');

const index = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();

        return res.status(200).json({
            service: 'orders-api',
            data: orders,
        });
    } catch (error) {
        console.error('Erro ao listar pedidos:', error);

        return res.status(500).json({
            error: 'Erro interno do servidor',
        });
    }
};

const show = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);

        if (!order) {
            return res.status(404).json({
                error: 'Pedido não encontrado',
            });
        }

        return res.status(200).json({
            service: 'orders-api',
            data: order,
        });
    } catch (error) {
        console.error('Erro ao buscar pedido:', error);

        return res.status(500).json({
            error: 'Erro interno do servidor',
        });
    }
};

const create = async (req, res) => {
    try {
        const order = await orderService.createOrder(req.body);

        return res.status(201).json({
            service: 'orders-api',
            data: order,
        });
    } catch (error) {
        if (error.statusCode === 400) {
            return res.status(400).json({
                error: error.message,
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                error: 'Usuário informado não existe',
            });
        }

        console.error('Erro ao criar pedido:', error);

        return res.status(500).json({
            error: 'Erro interno do servidor',
        });
    }
};

const update = async (req, res) => {
    try {
        const order = await orderService.updateOrder(
            req.params.id,
            req.body
        );

        if (!order) {
            return res.status(404).json({
                error: 'Pedido não encontrado',
            });
        }

        return res.status(200).json({
            service: 'orders-api',
            data: order,
        });
    } catch (error) {
        if (error.statusCode === 400) {
            return res.status(400).json({
                error: error.message,
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                error: 'Usuário informado não existe',
            });
        }

        console.error('Erro ao atualizar pedido:', error);

        return res.status(500).json({
            error: 'Erro interno do servidor',
        });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await orderService.deleteOrder(req.params.id);

        if (!order) {
            return res.status(404).json({
                error: 'Pedido não encontrado',
            });
        }

        return res.status(200).json({
            service: 'orders-api',
            data: order,
        });
    } catch (error) {
        console.error('Erro ao excluir pedido:', error);

        return res.status(500).json({
            error: 'Erro interno do servidor',
        });
    }
};

module.exports = {
    index,
    show,
    create,
    update,
    deleteOrder,
};
