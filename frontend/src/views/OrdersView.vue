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
    <h1>Pedidos</h1>

    <p>Gerenciamento dos pedidos cadastrados no sistema.</p>

    <h2>
      {{ editingOrderId ? 'Editar pedido' : 'Novo pedido' }}
    </h2>

    <form @submit.prevent="handleSubmit">
      <div>
        <label for="user">Cliente</label>

        <select
          id="user"
          v-model="form.user_id"
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

      <div>
        <label for="total">Valor</label>

        <input
          id="total"
          v-model.number="form.total"
          type="number"
          min="0.01"
          step="0.01"
          required
        >
      </div>

      <div>
        <label for="status">Status</label>

        <select
          id="status"
          v-model="form.status"
          required
        >
          <option value="pending">Pendente</option>
          <option value="paid">Pago</option>
          <option value="shipped">Enviado</option>
        </select>
      </div>

      <button
        type="submit"
        :disabled="saving"
      >
        {{
          saving
            ? 'Salvando...'
            : editingOrderId
              ? 'Salvar alterações'
              : 'Cadastrar'
        }}
      </button>

      <button
        v-if="editingOrderId"
        type="button"
        @click="cancelEditing"
      >
        Cancelar
      </button>
    </form>

    <p v-if="loading">
      Carregando pedidos...
    </p>

    <p v-if="error">
      {{ error }}
    </p>

    <table v-if="!loading">
      <thead>
        <tr>
          <th>ID</th>
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
          <td>{{ order.id }}</td>
          <td>{{ order.customer }}</td>
          <td>{{ formatCurrency(order.total) }}</td>
          <td>{{ statusLabel(order.status) }}</td>
          <td>{{ formatDate(order.created_at) }}</td>

          <td>
            <button
              type="button"
              @click="startEditing(order)"
            >
              Editar
            </button>

            <button
              type="button"
              @click="handleDelete(order)"
            >
              Excluir
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>