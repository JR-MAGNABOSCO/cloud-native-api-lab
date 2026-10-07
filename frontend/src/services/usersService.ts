import type { CreateUser, UpdateUser, User, UsersResponse } from '@/types/User'

const API_URL = '/api/users'

export async function getUsers(): Promise<UsersResponse> {
    const response = await fetch(API_URL)

    if (!response.ok) {
        throw new Error('Não foi possível carregar os usuários')
    }

    return response.json()
}

export async function createUser(user: CreateUser): Promise<User> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })

    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.error ?? 'Não foi possível cadastrar o usuário')
    }

    return result.data
}

export async function updateUser(id: string, user: UpdateUser): Promise<User> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })

    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.error ?? 'Não foi possível atualizar o usuário')
    }

    return result.data
}

export async function deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    })

    if (!response.ok) {
        const result = await response.json()

        throw new Error(result.error ?? 'Não foi possível excluir o usuário')
    }
}