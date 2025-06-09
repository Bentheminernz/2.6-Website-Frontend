<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-1 container mx-auto p-2 mb-10">
      <RouterView />
    </main>
  </div>
</template>
