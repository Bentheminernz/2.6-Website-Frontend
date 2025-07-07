<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');

const error = ref<string | null>(null);

const handleLogin = async () => {
  try {
    await authStore.login(username.value, password.value);
    router.push({ name: 'games' });
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = 'An unexpected error occurred';
    }
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="text-3xl font-bold mb-4">Welcome Back!</h1>

    <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-md border p-4">
      <legend class="fieldset-legend">Login</legend>

      <label class="label">Email or Username</label>
      <input type="email" class="input w-full" placeholder="Email or Username" v-model="username" required />

      <label class="label">Password</label>
      <input type="password" class="input w-full" placeholder="Password" v-model="password" required />

      <div v-if="error" class="alert alert-error mt-2">
        <span>{{ error }}</span>
      </div>

      <button class="btn btn-primary mt-4" @click="handleLogin" :disabled="!username || !password">Login</button>
    </fieldset>
  </div>
</template>
