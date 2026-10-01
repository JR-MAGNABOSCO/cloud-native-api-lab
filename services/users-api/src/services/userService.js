const userRepository = require('../repositories/userRepository');

const getAllUsers = async () => {
    return userRepository.findAll();
};

const getUserById = async (id) => {
    return userRepository.findById(id);
};

const createUser = async (data) => {
    const name = data.name?.trim();
    const email = data.email?.trim().toLowerCase();

    if (!name || !email) {
        const error = new Error('Nome e e-mail são obrigatórios');
        error.statusCode = 400;
        throw error;
    }

    return userRepository.create(name, email);
};

const updateUser = async (id, data) => {
    const name = data.name?.trim();
    const email = data.email?.trim().toLowerCase();

    if (!name || !email) {
        const error = new Error('Nome e e-mail são obrigatórios');
        error.statusCode = 400;
        throw error;
    }

    return userRepository.update(id, name, email);
};

const deleteUser = async (id) => {
    return userRepository.remove(id);
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
