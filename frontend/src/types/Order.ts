export type OrderStatus = 'pending' | 'paid' | 'shipped'

export interface Order {
    id: string
    user_id: string
    customer: string
    total: string
    status: OrderStatus
    created_at: string
}

export interface OrdersResponse {
    service: string
    data: Order[]
}

export interface CreateOrder {
    user_id: string
    total: number
    status: OrderStatus
}

export interface UpdateOrder {
    user_id: string
    total: number
    status: OrderStatus
}