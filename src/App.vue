<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/navbar.vue'
import Toast from './components/Toast.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header>
      <Navbar />
    </header>

    <main class="flex-1 container mx-auto p-2 mb-10">
      <RouterView />
    </main>

    <Toast />
  </div>
</template>
