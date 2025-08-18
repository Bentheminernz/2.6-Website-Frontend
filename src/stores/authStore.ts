import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { User, UserCart, OwnedGame } from '@/types/User'
import { useToastStore } from './toast'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth_token') || '')
  const user = ref<User | null>(null)
  const userCart = ref<UserCart | null>(null)
  const ownedGames = ref<OwnedGame[]>([])
  const isLoading = ref(false)
  const error = ref('')

  const toastStore = useToastStore()
  const router = useRouter()
  const isAuthenticated = computed(() => !!token.value)

  async function initialize() {
    if (token.value) {
      await fetchUser()
      await fetchUserCart()
      await fetchOwnedGames()
    }
  }

  async function login(username: string, password: string) {
    isLoading.value = true
    error.value = ''

    try {
      const response = await fetch('/api/token-auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      token.value = data.token
      localStorage.setItem('auth_token', token.value)

      await fetchUser()
      await fetchUserCart()
      await fetchOwnedGames()
      router.push({ name: 'games' })
      toastStore.showSuccess('Login successful')
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'An unexpected error occurred'
      }
      toastStore.showError(error.value)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUser() {
    if (!token.value) {
      user.value = null
      return
    }

    isLoading.value = true
    error.value = ''

    try {
      const response = await fetch('/api/user/', {
        method: 'GET',
        headers: {
          Authorization: `Token ${token.value}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })

      const data = await response.json()

      if (data.detail === 'Invalid token.') {
        token.value = ''
        user.value = null
        userCart.value = null
        ownedGames.value = []
        localStorage.removeItem('auth_token')
        router.push('/')
        return
      }

      if (!response.ok) {
        toastStore.showError(data.message || 'Failed to fetch user data')
        throw new Error(data.message || 'Failed to fetch user data')
      }

      user.value = data.data as User
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'An unexpected error occurred'
      }
      toastStore.showError(error.value)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUserCart() {
    if (!token.value) {
      userCart.value = null
      return
    }

    isLoading.value = true
    error.value = ''

    try {
      const response = await fetch('/api/cart/view/', {
        method: 'GET',
        headers: {
          Authorization: `Token ${token.value}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        toastStore.showError(data.message || 'Failed to fetch user cart')
        throw new Error(data.message || 'Failed to fetch user cart')
      }

      userCart.value = data.data as UserCart
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'An unexpected error occurred'
      }
      toastStore.showError(error.value)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchOwnedGames() {
    if (!token.value) {
      ownedGames.value = []
      return
    }

    isLoading.value = true
    error.value = ''

    try {
      const response = await fetch('/api/games/owned/', {
        method: 'GET',
        headers: {
          Authorization: `Token ${token.value}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        toastStore.showError(data.message || 'Failed to fetch owned games')
        throw new Error(data.message || 'Failed to fetch owned games')
      }

      ownedGames.value = data.data as OwnedGame[]
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'An unexpected error occurred'
      }
      toastStore.showError(error.value)
    } finally {
      isLoading.value = false
    }
  }

  async function createUser(
    username: string,
    email: string,
    password: string,
    firstname: string,
    lastname: string,
  ) {
    isLoading.value = true
    error.value = ''

    try {
      const response = await fetch('/api/user/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          first_name: firstname,
          last_name: lastname,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toastStore.showError(data.message || 'User creation failed')
        throw new Error(data.message || 'User creation failed')
      }

      if (data.success) {
        await login(username, password)
      } else {
        toastStore.showError(data.message || 'User creation failed')
        throw new Error(data.message || 'User creation failed')
      }
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'An unexpected error occurred'
      }
      toastStore.showError(error.value)
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    token.value = ''
    user.value = null
    userCart.value = null
    ownedGames.value = []
    error.value = ''
    isLoading.value = false
    localStorage.removeItem('auth_token')
    router.push('/')
    toastStore.showSuccess('Logged out')
  }

  return {
    token,
    user,
    userCart,
    ownedGames,
    isLoading,
    error,
    isAuthenticated,
    login,
    fetchUser,
    initialize,
    fetchUserCart,
    fetchOwnedGames,
    createUser,
    logout,
  }
})
