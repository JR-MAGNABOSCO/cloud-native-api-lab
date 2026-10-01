const userService = require('../services/userService');

const index = async (req, res) => {
    try {
        const users = await userService.getAllUsers();

        return res.status(200).json({
            service: 'users-api',
            data: users,
        });
    } catch (error) {
        console.error('Erro ao listar usuários:', error);

        return res.status(500).json({
            error: 'Erro interno do servidor',
        });
    }
};

const show = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);

        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado',
            });
        }

        return res.status(200).json({
            service: 'users-api',
            data: user,
        });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);

        return res.status(500).json({
            error: 'Erro interno do servidor',
        });
    }
};

const create = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);

        return res.status(201).json({
            service: 'users-api',
            data: user,
        });
    } catch (error) {
        if (error.statusCode === 400) {
            return res.status(400).json({
                error: error.message,
            });
        }

        if (error.code === '23505') {
            return res.status(409).json({
                error: 'E-mail já cadastrado',
            });
        }

        console.error('Erro ao criar usuário:', error);

        return res.status(500).json({
            error: 'Erro interno do servidor',
        });
    }
};

const update = async (req, res) => {
    try {
        const user = await userService.updateUser(
            req.params.id,
            req.body
        );

        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado',
            });
        }

        return res.status(200).json({
            service: 'users-api',
            data: user,
        });
    } catch (error) {
        if (error.statusCode === 400) {
            return res.status(400).json({
                error: error.message,
            });
        }

        if (error.code === '23505') {
            return res.status(409).json({
                error: 'E-mail já cadastrado',
            });
        }

        console.error('Erro ao atualizar usuário:', error);

        return res.status(500).json({
            error: 'Erro interno do servidor',
        });
    }
};

const destroy = async (req, res) => {
    try {
        const user = await userService.deleteUser(req.params.id);

        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado',
            });
        }

        return res.status(200).json({
            service: 'users-api',
            data: user,
        });
    } catch (error) {
        if (error.code === '23503') {
            return res.status(409).json({
                error: 'Não é possível excluir o usuário, pois existem pedidos associados a ele',
            });
        }

        console.error('Erro ao excluir usuário:', error);

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
    destroy,
};
