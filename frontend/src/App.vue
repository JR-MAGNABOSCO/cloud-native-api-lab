<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <h2>Cloud Native API Lab</h2>

    <nav>
      <RouterLink to="/">Início</RouterLink>
      <RouterLink to="/users">Usuários</RouterLink>
      <RouterLink to="/orders">Pedidos</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>