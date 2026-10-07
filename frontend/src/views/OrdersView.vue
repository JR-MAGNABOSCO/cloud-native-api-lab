<script setup lang="ts">
import { onMounted, ref } from 'vue'

import {
  createOrder,
  deleteOrder,
  getOrders,
  updateOrder,
} from '@/services/ordersService'

import { getUsers } from '@/services/usersService'

import type {
  CreateOrder,
  Order,
  OrderStatus,
} from '@/types/Order'

import type { User } from '@/types/User'

const orders = ref<Order[]>([])
const users = ref<User[]>([])

const loading = ref(true)
const saving = ref(false)
const error = ref('')

const editingOrderId = ref<string | null>(null)

const form = ref<CreateOrder>({
  user_id: '',
  total: 0,
  status: 'pending',
})

async function loadData() {
  loading.value = true
  error.value = ''

  try {
    const [ordersResponse, usersResponse] = await Promise.all([
      getOrders(),
      getUsers(),
    ])

    orders.value = ordersResponse.data
    users.value = usersResponse.data
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Não foi possível carregar os dados'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.value = {
    user_id: '',
    total: 0,
    status: 'pending',
  }

  editingOrderId.value = null
}

async function handleSubmit() {
  saving.value = true
  error.value = ''

  try {
    if (editingOrderId.value) {
      await updateOrder(editingOrderId.value, form.value)
    } else {
      await createOrder(form.value)
    }

    resetForm()
    await loadData()
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Não foi possível salvar o pedido'
  } finally {
    saving.value = false
  }
}

function startEditing(order: Order) {
  editingOrderId.value = order.id

  form.value = {
    user_id: order.user_id,
    total: Number(order.total),
    status: order.status,
  }
}

function cancelEditing() {
  resetForm()
}

async function handleDelete(order: Order) {
  const confirmed = window.confirm(
    `Deseja realmente excluir o pedido #${order.id}?`,
  )

  if (!confirmed) {
    return
  }

  error.value = ''

  try {
    await deleteOrder(order.id)
    await loadData()
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Não foi possível excluir o pedido'
  }
}

function formatCurrency(value: string) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('pt-BR')
}

function statusLabel(status: OrderStatus) {
  const labels: Record<OrderStatus, string> = {
    pending: 'Pendente',
    paid: 'Pago',
    shipped: 'Enviado',
  }

  return labels[status]
}

onMounted(loadData)
</script>

<template>
  <main>
    <div class="page-header">
      <div class="page-title">
        <h1>Pedidos</h1>
        <p>Acompanhe e gerencie os pedidos da plataforma.</p>
      </div>

      <div class="page-counter">
        <span>{{ orders.length }}</span>
        pedidos cadastrados
      </div>
    </div>

    <!-- Formulário -->
    <section class="card">
      <div class="card-header">
        <h2>
          {{ editingOrderId ? 'Editar pedido' : 'Novo pedido' }}
        </h2>

        <p>
          {{
            editingOrderId
              ? 'Atualize as informações do pedido selecionado.'
              : 'Cadastre um novo pedido na plataforma.'
          }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-grid orders-form-grid">
          <div class="form-group">
            <label for="user">Cliente</label>

            <select
              id="user"
              v-model="form.user_id"
              class="form-control"
              required
            >
              <option value="" disabled>
                Selecione um cliente
              </option>

              <option
                v-for="user in users"
                :key="user.id"
                :value="user.id"
              >
                {{ user.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="total">Valor do pedido</label>

            <input
              id="total"
              v-model.number="form.total"
              class="form-control"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0,00"
              required
            >
          </div>

          <div class="form-group">
            <label for="status">Status</label>

            <select
              id="status"
              v-model="form.status"
              class="form-control"
              required
            >
              <option value="pending">
                Pendente
              </option>

              <option value="paid">
                Pago
              </option>

              <option value="shipped">
                Enviado
              </option>
            </select>
          </div>

          <div class="form-actions">
            <button
              class="btn btn-primary"
              type="submit"
              :disabled="saving"
            >
              {{
                saving
                  ? 'Salvando...'
                  : editingOrderId
                    ? 'Salvar alterações'
                    : 'Cadastrar pedido'
              }}
            </button>

            <button
              v-if="editingOrderId"
              class="btn btn-secondary"
              type="button"
              @click="cancelEditing"
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>

      <div
        v-if="error"
        class="alert alert-error"
      >
        {{ error }}
      </div>
    </section>

    <!-- Tabela -->
    <section class="card table-card">
      <div class="card-header table-header">
        <div>
          <h2>Pedidos cadastrados</h2>
          <p>Histórico dos pedidos registrados na plataforma.</p>
        </div>

        <span class="record-count">
          {{ orders.length }} registros
        </span>
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
        <table class="data-table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="order in orders"
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
                <strong class="order-value">
                  {{ formatCurrency(order.total) }}
                </strong>
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

              <td class="secondary-text">
                {{ formatDate(order.created_at) }}
              </td>

              <td>
                <div class="table-actions">
                  <button
                    class="btn btn-edit"
                    type="button"
                    @click="startEditing(order)"
                  >
                    Editar
                  </button>

                  <button
                    class="btn btn-danger"
                    type="button"
                    @click="handleDelete(order)"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="orders.length === 0">
              <td
                colspan="6"
                class="empty-state"
              >
                Nenhum pedido cadastrado.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>