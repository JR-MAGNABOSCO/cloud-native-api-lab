export interface HealthResponse {
    service: string
    status: 'ready' | 'not ready'
    database: 'connected' | 'unavailable'
}

async function checkHealth(url: string): Promise<HealthResponse> {
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error('Serviço indisponível')
    }

    return response.json()
}

export function getUsersHealth(): Promise<HealthResponse> {
    return checkHealth('/api/users/health/ready')
}

export function getOrdersHealth(): Promise<HealthResponse> {
    return checkHealth('/api/orders/health/ready')
}