import type {
    CreateOrder,
    Order,
    OrdersResponse,
    UpdateOrder,
} from '@/types/Order'

const API_URL = '/api/orders'

export async function getOrders(): Promise<OrdersResponse> {
    const response = await fetch(API_URL)

    if (!response.ok) {
        throw new Error('Não foi possível carregar os pedidos')
    }

    return response.json()
}

export async function createOrder(order: CreateOrder): Promise<Order> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    })

    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.error ?? 'Não foi possível cadastrar o pedido')
    }

    return result.data
}

export async function updateOrder(
    id: string,
    order: UpdateOrder,
): Promise<Order> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    })

    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.error ?? 'Não foi possível atualizar o pedido')
    }

    return result.data
}

export async function deleteOrder(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    })

    if (!response.ok) {
        const result = await response.json()

        throw new Error(result.error ?? 'Não foi possível excluir o pedido')
    }
}