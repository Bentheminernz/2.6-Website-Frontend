<script lang="ts" setup>
import { useToastStore } from '@/stores/toast';
import { PhX, PhCheckCircle, PhInfo, PhWarning, PhXCircle } from '@phosphor-icons/vue';

const toastStore = useToastStore();


const getAlertClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'alert-success'
    case 'error':
      return 'alert-error'
    case 'warning':
      return 'alert-warning'
    case 'info':
    default:
      return 'alert-info'
  }
}
</script>

<template>
  <div class="toast toast-top toast-end z-50">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="alert mb-2 shadow-lg"
        :class="getAlertClass(toast.type)"
      >
        <component
          :is="
            {
              success: PhCheckCircle,
              error: PhXCircle,
              warning: PhWarning,
              info: PhInfo,
            }[toast.type]
          "
          :size="24"
        />

        <span>{{ toast.message }}</span>
        <button @click="toastStore.removeToast(toast.id)" class="btn btn-ghost btn-sm btn-circle">
          <PhX :size="16" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
