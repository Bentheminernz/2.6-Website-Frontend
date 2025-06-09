<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { ref, onMounted } from 'vue';

const authStore = useAuthStore();

const username = ref('');
const password = ref('');
</script>

<template>
  <h1>Home View</h1>
  <fieldset class="fieldset">
    <label for="username">Username:</label>
    <input class="input" type="text" id="username" v-model="username" />

    <label for="password">Password:</label>
    <input class="input" type="password" id="password" v-model="password" />

    <button class="btn btn-primary" @click="authStore.login(username, password)">Login</button>
  </fieldset>

  <div v-if="authStore.isAuthenticated">
    <h2>Welcome, {{ authStore.user?.username }}!</h2>
  </div>
</template>
