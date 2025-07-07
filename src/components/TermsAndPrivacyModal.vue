<script lang="ts" setup>
import { ref, watch, defineEmits } from 'vue'

const emit = defineEmits(['agreed'])

const tabView = ref<'terms' | 'privacy'>('terms')
const hasReadTerms = ref(false)
const hasReadPrivacy = ref(false)

watch(tabView, (newTab: 'terms' | 'privacy') => {
  if (newTab === 'terms') {
    hasReadTerms.value = true
  } else if (newTab === 'privacy') {
    hasReadPrivacy.value = true
  }
})

function handleAgree() {
  emit('agreed')
  closeModal()
}

const closeModal = () => {
  const modal = document.getElementById('termsPrivacyModal') as HTMLDialogElement
  if (modal) modal.close()
}
</script>

<template>
  <dialog id="termsPrivacyModal" class="modal">
    <div class="modal-box max-w-10/12">
      <div class="tabs tabs-border">
        <input type="radio" name="tab" id="termsTab" class="tab tab-bordered" v-model="tabView" value="terms" aria-label="Terms of Service">
        <div class="tab-content border-base-300 bg-base-100 p-10">
          <p class="text-sm mb-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint ab tempore harum mollitia, possimus laborum adipisci minima exercitationem, odit aspernatur maiores, ex eaque corrupti iure perspiciatis ipsum nisi accusantium. Ducimus!</p>
          <p class="text-sm mb-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.</p>
        </div>

        <input type="radio" name="tab" id="privacyTab" class="tab tab-bordered" v-model="tabView" value="privacy" aria-label="Privacy Policy">
        <div class="tab-content border-base-300 bg-base-100 p-10">
          <p class="text-sm mb-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint ab tempore harum mollitia, possimus laborum adipisci minima exercitationem, odit aspernatur maiores, ex eaque corrupti iure perspiciatis ipsum nisi accusantium. Ducimus!</p>
          <p class="text-sm mb-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.</p>
        </div>
      </div>

      <form method="dialog" class="modal-action">
        <button
          type="button"
          class="btn btn-secondary"
          @click="closeModal"
        >
          Cancel
        </button>

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="(tabView === 'terms' && !hasReadTerms) || (tabView === 'privacy' && !hasReadPrivacy)"
          @click="handleAgree"
        >
          I have read and agree to the Terms of Service and Privacy Policy
        </button>
      </form>
    </div>
  </dialog>
</template>
