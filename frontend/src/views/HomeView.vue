<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { getOrders } from '@/services/ordersService'
import { getUsers } from '@/services/usersService'

import type { Order } from '@/types/Order'
import type { User } from '@/types/User'

const users = ref<User[]>([])
const orders = ref<Order[]>([])

const loading = ref(true)
const error = ref('')

const pendingOrders = computed(() => {
  return orders.value.filter((order) => order.status === 'pending').length
})

const paidOrders = computed(() => {
  return orders.value.filter((order) => order.status === 'paid').length
})

const revenue = computed(() => {
  return orders.value
    .filter((order) => order.status === 'paid')
    .reduce((total, order) => total + Number(order.total), 0)
})

const recentOrders = computed(() => {
  return [...orders.value]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime(),
    )
    .slice(0, 5)
})

async function loadDashboard() {
  loading.value = true
  error.value = ''

  try {
    const [usersResponse, ordersResponse] = await Promise.all([
      getUsers(),
      getOrders(),
    ])

    users.value = usersResponse.data
    orders.value = ordersResponse.data
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Não foi possível carregar o dashboard'
  } finally {
    loading.value = false
  }
}

function formatCurrency(value: number | string) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function statusLabel(status: Order['status']) {
  const labels = {
    pending: 'Pendente',
    paid: 'Pago',
    shipped: 'Enviado',
  }

  return labels[status]
}

onMounted(loadDashboard)
</script>

<template>
  <main>
    <div class="page-header">
      <div class="page-title">
        <h1>Visão Geral</h1>
        <p>
          Acompanhe os principais indicadores da plataforma.
        </p>
      </div>

      <div class="dashboard-environment">
        <span class="status-dot"></span>
        Ambiente local
      </div>
    </div>

    <div
      v-if="error"
      class="alert alert-error dashboard-alert"
    >
      {{ error }}
    </div>

    <!-- Indicadores -->
    <section class="metrics-grid">
      <article class="metric-card">
        <div class="metric-header">
          <span>Usuários</span>
          <div class="metric-icon metric-icon-blue">
            U
          </div>
        </div>

        <strong class="metric-value">
          {{ loading ? '—' : users.length }}
        </strong>

        <span class="metric-description">
          cadastrados na plataforma
        </span>
      </article>

      <article class="metric-card">
        <div class="metric-header">
          <span>Pedidos</span>
          <div class="metric-icon metric-icon-cyan">
            P
          </div>
        </div>

        <strong class="metric-value">
          {{ loading ? '—' : orders.length }}
        </strong>

        <span class="metric-description">
          pedidos registrados
        </span>
      </article>

      <article class="metric-card">
        <div class="metric-header">
          <span>Pendentes</span>
          <div class="metric-icon metric-icon-orange">
            !
          </div>
        </div>

        <strong class="metric-value">
          {{ loading ? '—' : pendingOrders }}
        </strong>

        <span class="metric-description">
          aguardando processamento
        </span>
      </article>

      <article class="metric-card">
        <div class="metric-header">
          <span>Faturamento</span>
          <div class="metric-icon metric-icon-green">
            $
          </div>
        </div>

        <strong class="metric-value metric-money">
          {{ loading ? '—' : formatCurrency(revenue) }}
        </strong>

        <span class="metric-description">
          total de pedidos pagos
        </span>
      </article>
    </section>

    <!-- Conteúdo inferior -->
    <section class="dashboard-grid">
      <!-- Pedidos recentes -->
      <article class="card">
        <div class="card-header table-header">
          <div>
            <h2>Pedidos recentes</h2>
            <p>Últimas movimentações registradas.</p>
          </div>

          <RouterLink
            to="/orders"
            class="view-all-link"
          >
            Ver todos
          </RouterLink>
        </div>

        <div
          v-if="loading"
          class="loading"
        >
          Carregando pedidos...
        </div>

        <div
          v-else
          class="table-wrapper"
        >
          <table class="data-table dashboard-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="order in recentOrders"
                :key="order.id"
              >
                <td>
                  <span class="id-column">
                    #{{ order.id }}
                  </span>
                </td>

                <td>
                  <strong class="customer-name">
                    {{ order.customer }}
                  </strong>
                </td>

                <td>
                  {{ formatCurrency(order.total) }}
                </td>

                <td>
                  <span
                    class="badge"
                    :class="{
                      'badge-warning': order.status === 'pending',
                      'badge-success': order.status === 'paid',
                      'badge-info': order.status === 'shipped',
                    }"
                  >
                    <span class="badge-dot"></span>
                    {{ statusLabel(order.status) }}
                  </span>
                </td>
              </tr>

              <tr v-if="recentOrders.length === 0">
                <td
                  colspan="4"
                  class="empty-state"
                >
                  Nenhum pedido cadastrado.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <!-- Infraestrutura -->
      <article class="card infrastructure-card">
        <div class="card-header">
          <h2>Infraestrutura</h2>
          <p>Arquitetura atual do ambiente.</p>
        </div>

        <div class="infrastructure-list">
          <div class="infrastructure-item">
            <div>
              <strong>Users API</strong>
              <span>Node.js / Express</span>
            </div>

            <span class="infra-badge">
              <span class="status-dot"></span>
              Ativo
            </span>
          </div>

          <div class="infrastructure-item">
            <div>
              <strong>Orders API</strong>
              <span>Node.js / Express</span>
            </div>

            <span class="infra-badge">
              <span class="status-dot"></span>
              Ativo
            </span>
          </div>

          <div class="infrastructure-item">
            <div>
              <strong>PostgreSQL</strong>
              <span>Banco de dados</span>
            </div>

            <span class="infra-badge">
              <span class="status-dot"></span>
              Conectado
            </span>
          </div>

          <div class="infrastructure-item">
            <div>
              <strong>Kubernetes</strong>
              <span>Minikube</span>
            </div>

            <span class="technology-badge">
              Local
            </span>
          </div>

          <div class="infrastructure-item">
            <div>
              <strong>Gateway</strong>
              <span>Envoy Gateway</span>
            </div>

            <span class="technology-badge">
              Gateway API
            </span>
          </div>
        </div>
      </article>
    </section>

    <section class="dashboard-summary">
      <span>
        {{ paidOrders }} pedidos pagos
      </span>

      <span class="summary-divider"></span>

      <span>
        {{ pendingOrders }} pendentes
      </span>

      <span class="summary-divider"></span>

      <span>
        {{ users.length }} usuários
      </span>
    </section>
  </main>
</template>