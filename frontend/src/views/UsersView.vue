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
    <div class="page-header">
      <div class="page-title">
        <h1>Usuários</h1>
        <p>Gerencie os usuários cadastrados na plataforma.</p>
      </div>

      <div class="page-counter">
        <span>{{ users.length }}</span>
        usuários cadastrados
      </div>
    </div>

    <!-- Formulário -->
    <section class="card">
      <div class="card-header">
        <h2>
          {{ editingUserId ? 'Editar usuário' : 'Novo usuário' }}
        </h2>

        <p>
          {{
            editingUserId
              ? 'Atualize as informações do usuário selecionado.'
              : 'Cadastre um novo usuário na plataforma.'
          }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-grid users-form-grid">
          <div class="form-group">
            <label for="name">Nome</label>

            <input
              id="name"
              v-model="form.name"
              class="form-control"
              type="text"
              placeholder="Nome completo"
              required
            >
          </div>

          <div class="form-group">
            <label for="email">E-mail</label>

            <input
              id="email"
              v-model="form.email"
              class="form-control"
              type="email"
              placeholder="usuario@exemplo.com"
              required
            >
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
                  : editingUserId
                    ? 'Salvar alterações'
                    : 'Cadastrar usuário'
              }}
            </button>

            <button
              v-if="editingUserId"
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
          <h2>Usuários cadastrados</h2>
          <p>Lista de usuários disponíveis no sistema.</p>
        </div>

        <span class="record-count">
          {{ users.length }} registros
        </span>
      </div>

      <div
        v-if="loading"
        class="loading"
      >
        Carregando usuários...
      </div>

      <div
        v-else
        class="table-wrapper"
      >
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuário</th>
              <th>E-mail</th>
              <th>Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="user in users"
              :key="user.id"
            >
              <td>
                <span class="id-column">
                  #{{ user.id }}
                </span>
              </td>

              <td>
                <div class="user-cell">
                  <div class="user-avatar">
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>

                  <strong>{{ user.name }}</strong>
                </div>
              </td>

              <td class="secondary-text">
                {{ user.email }}
              </td>

              <td class="secondary-text">
                {{ new Date(user.created_at).toLocaleDateString('pt-BR') }}
              </td>

              <td>
                <div class="table-actions">
                  <button
                    class="btn btn-edit"
                    type="button"
                    @click="startEditing(user)"
                  >
                    Editar
                  </button>

                  <button
                    class="btn btn-danger"
                    type="button"
                    @click="handleDelete(user)"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="users.length === 0">
              <td
                colspan="5"
                class="empty-state"
              >
                Nenhum usuário cadastrado.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>