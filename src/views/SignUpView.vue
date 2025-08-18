<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const firstName = ref('')
const lastName = ref('')

const doPasswordsMatch = computed(() => {
  return password.value === confirmPassword.value
})
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="text-3xl font-bold mb-4">Create an Account</h1>

    <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-md border p-4">
      <legend class="fieldset-legend">Sign Up</legend>

      <div class="flex">
        <div class="flex-1 mr-2">
          <label class="label">First Name</label>
          <input
            type="text"
            class="input w-full"
            placeholder="First Name"
            v-model="firstName"
            required
          />
        </div>
        <div class="flex-1 ml-2">
          <label class="label">Last Name</label>
          <input
            type="text"
            class="input w-full"
            placeholder="Last Name"
            v-model="lastName"
            required
          />
        </div>
      </div>

      <label class="label">Username</label>
      <input type="text" class="input w-full" placeholder="Username" v-model="username" required />

      <label class="label">Email</label>
      <input type="email" class="input w-full" placeholder="Email" v-model="email" required />

      <label class="label">Password</label>
      <input
        type="password"
        class="input w-full"
        placeholder="Password"
        v-model="password"
        required
        :class="
          password.length > 0 && confirmPassword.length > 0
            ? doPasswordsMatch
              ? 'input-success'
              : 'input-error'
            : ''
        "
      />

      <label class="label">Confirm Password</label>
      <input
        type="password"
        class="input w-full"
        placeholder="Confirm Password"
        v-model="confirmPassword"
        required
        :class="
          password.length > 0 && confirmPassword.length > 0
            ? doPasswordsMatch
              ? 'input-success'
              : 'input-error'
            : ''
        "
      />

      <button
        class="btn btn-primary mt-4"
        @click.prevent="
          async () => {
            try {
              await authStore.createUser(username, email, password, firstName, lastName)
              router.push({ name: 'games' })
            } catch (err) {
              console.error(err)
            }
          }
        "
        :disabled="
          !username ||
          !email ||
          !password ||
          !confirmPassword ||
          !firstName ||
          !lastName ||
          !doPasswordsMatch
        "
      >
        Sign Up
      </button>
    </fieldset>
  </div>
</template>
