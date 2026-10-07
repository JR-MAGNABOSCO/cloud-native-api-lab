export interface User {
    id: string
    name: string
    email: string
    created_at: string
}

export interface UsersResponse {
    service: string
    data: User[]
}

export interface CreateUser {
    name: string
    email: string
}

export interface UpdateUser {
    name: string
    email: string
}