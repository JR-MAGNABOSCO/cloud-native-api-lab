<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { createUser, updateUser, getUsers, deleteUser } from '@/services/usersService'
import type { CreateUser, User } from '@/types/User'

const users = ref<User[]>([])

const form = ref<CreateUser>({
  name: '',
  email: '',
})

const loading = ref(true)
const saving = ref(false)
const editingUserId = ref<string | null>(null)
const error = ref<string | null>(null)

async function loadUsers() {
  try {
    loading.value = true
    error.value = null

    const response = await getUsers()

    users.value = response.data
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : 'Erro inesperado ao carregar usuários'
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  try {
    saving.value = true
    error.value = null

    if (editingUserId.value) {
      await updateUser(editingUserId.value, form.value)
    } else {
      await createUser(form.value)
    }
    cancelEditing()

    await loadUsers()
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : 'Erro inesperado ao cadastrar usuário'
  } finally {
    saving.value = false
  }
}

function startEditing(user: User) {
  editingUserId.value = user.id

  form.value = {
    name: user.name,
    email: user.email,
  }
}

function cancelEditing() {
  editingUserId.value = null

  form.value = {
    name: '',
    email: '',
  }
}

async function handleDelete(user: User) {
  const confirmed = window.confirm(
    `Deseja realmente excluir o usuário "${user.name}"?`,
  )

  if (!confirmed) {
    return
  }

  try {
    error.value = null

    await deleteUser(user.id)

    await loadUsers()
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : 'Erro inesperado ao excluir usuário'
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <main>
    <h1>Usuários</h1>

    <p>Gerenciamento dos usuários cadastrados no sistema.</p>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="name">Nome</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
        />
      </div>

      <div>
        <label for="email">E-mail</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
        />
      </div>

      <button type="submit" :disabled="saving">
        {{ saving ? 'Salvando...' : 'Cadastrar' }}
      </button>
    </form>

    <p v-if="loading">Carregando usuários...</p>

    <p v-else-if="error">
      {{ error }}
    </p>

    <table v-else>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>E-mail</th>
          <th>Ações</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <button type="button" @click="startEditing(user)">Editar</button>
            <button type="button" @click="cancelEditing()">Cancelar</button>
            <button type="button" @click="handleDelete(user)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>