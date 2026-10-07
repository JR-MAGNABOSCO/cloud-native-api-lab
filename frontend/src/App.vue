<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">
          ☁
        </div>

        <div>
          <strong>Cloud Native</strong>
          <span>API Lab</span>
        </div>
      </div>

      <nav class="navigation">
        <span class="navigation-title">MENU</span>

        <RouterLink to="/" class="nav-link">
          <span class="nav-icon">⌂</span>
          Visão Geral
        </RouterLink>

        <RouterLink to="/users" class="nav-link">
          <span class="nav-icon">♙</span>
          Usuários
        </RouterLink>

        <RouterLink to="/orders" class="nav-link">
          <span class="nav-icon">▣</span>
          Pedidos
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="environment">
          <span class="environment-dot"></span>

          <div>
            <strong>Ambiente local</strong>
            <span>Kubernetes / Minikube</span>
          </div>
        </div>
      </div>
    </aside>

    <section class="main-area">
      <header class="topbar">
        <div>
          <span class="topbar-label">AMBIENTE</span>
          <strong>Cloud Native API Lab</strong>
        </div>

        <div class="cluster-status">
          <span class="status-dot"></span>
          Cluster online
        </div>
      </header>

      <div class="page-container">
        <RouterView />
      </div>
    </section>
  </div>
</template>