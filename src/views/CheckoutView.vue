<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { PhCheckCircle } from '@phosphor-icons/vue'
import type { CheckoutFormData } from '@/types/User'
import { createOrder } from '@/utils/OrderAPIs'
import type { OrderResponse } from '@/types/Game'
import TermsAndPrivacyModal from '@/components/TermsAndPrivacyModal.vue'

const authStore = useAuthStore()
const router = useRouter()

const formData = ref<CheckoutFormData>({
  firstName: `${authStore.user?.first_name || ''}`,
  lastName: `${authStore.user?.last_name || ''}`,
  email: `${authStore.user?.email || ''}`,
  address: {
    street_address: '',
    suburb: '',
    city: '',
    postcode: '',
    country: '',
  },
  cardDetails: {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  },
  agreeToTermsAndPrivacy: false,
  saveCard: false,
  saveAddress: false,
})
const createOrderResponse = ref<{ success: boolean; message?: string; data?: OrderResponse }>({
  success: false,
})

const errors = ref({})

const validateForm = () => {
  const newErrors: Record<string, string> = {}

  if (!formData.value.firstName.trim()) newErrors.firstName = 'First name is required'
  if (!formData.value.lastName.trim()) newErrors.lastName = 'Last name is required'
  if (!formData.value.email.trim()) newErrors.email = 'Email is required'
  if (!formData.value.address.street_address.trim()) newErrors.street = 'Street is required'
  if (!formData.value.address.suburb.trim()) newErrors.suburb = 'Suburb is required'
  if (!formData.value.address.city.trim()) newErrors.city = 'City is required'
  if (!formData.value.address.postcode.trim()) newErrors.postcode = 'Postcode is required'
  if (!formData.value.address.country.trim()) newErrors.country = 'Country is required'
  if (!formData.value.cardDetails.cardNumber.trim())
    newErrors.cardNumber = 'Card number is required'
  if (!formData.value.cardDetails.expiryDate.trim())
    newErrors.expiryDate = 'Expiry date is required'
  if (!formData.value.cardDetails.cvv.trim()) newErrors.cvv = 'CVV is required'
  if (!formData.value.cardDetails.nameOnCard.trim())
    newErrors.nameOnCard = 'Name on card is required'
  if (!formData.value.agreeToTermsAndPrivacy)
    newErrors.agreeToTermsAndPrivacy = 'You must agree to the terms and privacy policy'

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser && !formData.value.firstName) {
      formData.value.firstName = newUser.first_name || ''
      formData.value.lastName = newUser.last_name || ''
      formData.value.email = newUser.email || ''
    }
  },
  { immediate: true },
)

const isCompleteOrderDisabled = computed(() => {
  return (
    !formData.value.firstName ||
    !formData.value.lastName ||
    !formData.value.email ||
    !formData.value.address ||
    !formData.value.address.street_address ||
    !formData.value.address.suburb ||
    !formData.value.address.city ||
    !formData.value.address.postcode ||
    !formData.value.address.country ||
    !formData.value.cardDetails ||
    !formData.value.cardDetails.cardNumber ||
    !formData.value.cardDetails.expiryDate ||
    !formData.value.cardDetails.cvv ||
    !formData.value.cardDetails.nameOnCard ||
    !formData.value.agreeToTermsAndPrivacy
  )
})

function formatCardNumber(value: string) {
  value = value.replace(/\D/g, '')
  return value
    .replace(/(.{4})/g, '$1-')
    .replace(/-$/, '')
    .substr(0, 19)
}

function formatExpiryDate(value: string) {
  value = value.replace(/\D/g, '')
  if (value.length > 2) {
    value = value.substr(0, 2) + '/' + value.substr(2, 2)
  }
  return value.substr(0, 5)
}

const handleCreateOrder = async () => {
  if (!validateForm()) return

  const response = await createOrder({ ...formData.value })
  createOrderResponse.value = response

  const orderId = response.data?.id
  if (response.success && orderId) {
    router.push(`/order/${orderId}`)
  }
}

const selectedSavedAddress = ref('')
type Address = {
  street_address: string
  suburb: string
  city: string
  postcode: string
  country: string
}

const handleAddressSelection = (selectedAddress: Address | null) => {
  if (selectedAddress) {
    formData.value.address = {
      street_address: selectedAddress.street_address,
      suburb: selectedAddress.suburb,
      city: selectedAddress.city,
      postcode: selectedAddress.postcode,
      country: selectedAddress.country,
    }
  }
}
const resetSavedAddressSelection = () => {
  selectedSavedAddress.value = ''
}

const selectedSavedCard = ref('')
type SavedCard = {
  id: number
  cardNumber?: string
  lastFourDigits: string
  expiryDate: string
  nameOnCard: string
  cardBrand?: string
}

const handleCreditCardSelection = (selectedCard: SavedCard | null) => {
  if (selectedCard) {
    let formattedExpiryDate = selectedCard.expiryDate
    if (selectedCard.expiryDate && selectedCard.expiryDate.includes('-')) {
      const [year, month] = selectedCard.expiryDate.split('-')
      const shortYear = year.slice(-2)
      formattedExpiryDate = `${month}/${shortYear}`
    }

    formData.value.cardDetails = {
      cardNumber: selectedCard.cardNumber || `****${selectedCard.lastFourDigits}`,
      expiryDate: formattedExpiryDate,
      cvv: '',
      nameOnCard: selectedCard.nameOnCard,
    }
  }
}
const resetSavedCardSelection = () => {
  selectedSavedCard.value = ''
}

const openTermsAndPrivacyModal = () => {
  const modal = document.getElementById('termsPrivacyModal') as HTMLDialogElement
  if (modal) {
    modal.showModal()
  }
}
</script>
<template>
  <div class="flex flex-col lg:flex-row gap-8">
    <div class="flex-2 lg:w-2/3 p-8 rounded-lg">
      <h2 class="text-2xl font-semibold mb-6">Checkout</h2>

      <form @submit.prevent="handleCreateOrder" class="space-y-6">
        <fieldset class="fieldset bg-base-100 border-base-300 rounded-box border p-6">
          <legend class="fieldset-legend text-lg font-semibold">Customer Information</legend>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label" for="firstName">First Name</label>
              <input
                id="firstName"
                v-model="formData.firstName"
                type="text"
                class="input w-full"
                placeholder="John"
                required
              />
            </div>

            <div>
              <label class="label" for="lastName">Last Name</label>
              <input
                id="lastName"
                v-model="formData.lastName"
                type="text"
                class="input w-full"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <label class="label" for="email">Email Address</label>
            <label class="input validator w-full">
              <svg
                class="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </g>
              </svg>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="john.doe@example.com"
                required
              />
            </label>
          </div>
        </fieldset>

        <fieldset class="fieldset bg-base-100 border-base-300 rounded-box border p-6">
          <legend class="fieldset-legend text-lg font-semibold">Billing Address</legend>

          <div v-if="authStore.token">
            <label class="label" for="savedAddress">Saved Address</label>
            <select
              id="savedAddress"
              v-model="selectedSavedAddress"
              class="select w-full"
              @change="
                handleAddressSelection(
                  selectedSavedAddress ? JSON.parse(selectedSavedAddress) : null,
                )
              "
            >
              <option disabled value="">Select a saved address</option>
              <option
                v-for="address in authStore.user?.addresses"
                :key="address.id"
                :value="JSON.stringify(address)"
              >
                {{ address.street_address }}, {{ address.suburb }}, {{ address.city }},
                {{ address.postcode }}, {{ address.country }}
              </option>
            </select>
          </div>

          <div>
            <label class="label" for="address">Street Address</label>
            <input
              id="address"
              v-model="formData.address.street_address"
              type="text"
              class="input w-full"
              placeholder="123 Main Street"
              required
              @input="resetSavedAddressSelection"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label" for="suburb">Suburb</label>
              <input
                id="suburb"
                v-model="formData.address.suburb"
                type="text"
                class="input w-full"
                placeholder="Downtown"
                required
                @input="resetSavedAddressSelection"
              />
            </div>

            <div>
              <label class="label" for="city">City</label>
              <input
                id="city"
                v-model="formData.address.city"
                type="text"
                class="input w-full"
                placeholder="New York"
                required
                @input="resetSavedAddressSelection"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label" for="postcode">Postcode</label>
              <input
                id="postcode"
                v-model="formData.address.postcode"
                type="text"
                class="input w-full"
                placeholder="10001"
                required
                @input="resetSavedAddressSelection"
              />
            </div>

            <div>
              <label class="label" for="country">Country</label>
              <select
                id="country"
                v-model="formData.address.country"
                class="select w-full"
                required
                @input="resetSavedAddressSelection"
              >
                <option disabled selected value="">Select a country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="GB">United Kingdom</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="JP">Japan</option>
                <option value="NZ">New Zealand</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset class="fieldset bg-base-100 border-base-300 rounded-box border p-6">
          <legend class="fieldset-legend text-lg font-semibold">Payment Information</legend>

          <div v-if="authStore.token">
            <label class="label" for="savedCard">Saved Card</label>
            <select
              v-model="selectedSavedCard"
              id="savedCard"
              class="select w-full"
              @change="
                handleCreditCardSelection(selectedSavedCard ? JSON.parse(selectedSavedCard) : null)
              "
            >
              <option disabled value="">Select a saved card</option>
              <option
                v-for="card in authStore.user?.credit_cards"
                :key="card.id"
                :value="JSON.stringify(card)"
              >
                {{ card.nameOnCard }} - {{ card.cardBrand }} ****{{ card.lastFourDigits }}
              </option>
            </select>
          </div>

          <div>
            <label class="label" for="nameOnCard">Name on Card</label>
            <input
              id="nameOnCard"
              v-model="formData.cardDetails.nameOnCard"
              type="text"
              class="input w-full"
              placeholder="John Doe"
              required
              @input="resetSavedCardSelection"
            />
          </div>

          <div>
            <label class="label" for="cardNumber">Card Number</label>
            <input
              id="cardNumber"
              v-model="formData.cardDetails.cardNumber"
              type="text"
              class="input w-full"
              placeholder="1234 5678 9012 3456"
              maxlength="19"
              required
              @input="
                ((formData.cardDetails.cardNumber = formatCardNumber(
                  formData.cardDetails.cardNumber,
                )),
                resetSavedCardSelection())
              "
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label" for="expiryDate">Expiry Date</label>
              <input
                id="expiryDate"
                v-model="formData.cardDetails.expiryDate"
                type="text"
                class="input w-full"
                placeholder="MM/YY"
                maxlength="5"
                required
                @input="
                  ((formData.cardDetails.expiryDate = formatExpiryDate(
                    formData.cardDetails.expiryDate,
                  )),
                  resetSavedCardSelection())
                "
              />
            </div>

            <div>
              <label class="label" for="cvv">CVV</label>
              <input
                id="cvv"
                v-model="formData.cardDetails.cvv"
                type="text"
                class="input w-full"
                placeholder="123"
                maxlength="4"
                required
              />
            </div>
          </div>
        </fieldset>

        <fieldset class="fieldset bg-base-100 border-base-300 rounded-box border p-6">
          <legend class="fieldset-legend text-lg font-semibold">Terms & Conditions</legend>

          <div class="form-control">
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                :checked="formData.agreeToTermsAndPrivacy"
                class="checkbox checkbox-primary"
                required
                readonly
                tabindex="-1"
                aria-label="Agree to Terms of Service and Privacy Policy"
                :disabled="!formData.agreeToTermsAndPrivacy"
              />
              <span class="label-text"> I agree to the </span>
              <span
                @click.stop.prevent="openTermsAndPrivacyModal"
                class="link text-blue-500 hover:text-blue-700 cursor-pointer"
              >
                Terms of Service and Privacy Policy
              </span>
            </div>
          </div>

          <div class="form-control">
            <label class="label cursor-pointer">
              <input
                type="checkbox"
                v-model="formData.saveCard"
                class="checkbox checkbox-primary"
              />
              <span class="label-text">Save my card details for future purchases</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label cursor-pointer">
              <input
                type="checkbox"
                v-model="formData.saveAddress"
                class="checkbox checkbox-primary"
              />
              <span class="label-text">Save my address for future purchases</span>
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          class="btn btn-primary btn-lg w-full"
          :disabled="isCompleteOrderDisabled || authStore.userCart?.cart_items.length === 0"
        >
          Complete Order
        </button>
      </form>
    </div>

    <div class="flex-1 lg:w-1/3 bg-base-200 p-6 rounded-lg h-fit mt-10">
      <h2 class="text-2xl font-semibold mb-6">Order Summary</h2>

      <div v-if="authStore.userCart?.cart_items && authStore.userCart.cart_items.length > 0">
        <ul class="mb-4 space-y-3 max-h-128 overflow-y-auto">
          <li
            v-for="item in authStore.userCart?.cart_items"
            :key="item.id"
            class="flex items-center justify-between gap-3"
          >
            <img
              :src="item.game.image"
              alt="Game Cover"
              class="w-14 h-14 object-cover rounded-lg"
            />
            <div class="flex-1">
              <h3 class="font-medium text-sm">{{ item.game.title }}</h3>
              <p class="text-xs text-base-content/70">Digital Download</p>
            </div>
            <span class="font-semibold">${{ item.game.price }}</span>
          </li>
        </ul>

        <hr class="mb-4" />

        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span>Subtotal:</span>
            <span>${{ authStore.userCart?.cart_subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Tax:</span>
            <span>${{ (authStore.userCart?.cart_subtotal * 0.1).toFixed(2) }} incl</span>
          </div>
          <div class="flex justify-between">
            <span>Shipping:</span>
            <span>$5.95</span>
          </div>
        </div>

        <hr class="my-4" />

        <div class="text-lg font-bold flex justify-between">
          <span>Total:</span>
          <span>${{ (authStore.userCart?.cart_subtotal + 5.95).toFixed(2) }}</span>
        </div>

        <div class="mt-6 p-3 bg-success/10 rounded-lg">
          <div class="flex items-center gap-2 text-success text-sm">
            <PhCheckCircle :size="24" />
            <span class="font-medium">Secure Checkout</span>
          </div>
          <p class="text-xs text-base-content/70 mt-1">
            Your payment details (excluding CVV) are stored securely. CVV is required for payment
            verification but is <b>never</b> stored. Saved cards can autofill for convenience but
            still require CVV entry.
          </p>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <div class="text-4xl mb-4">🛒</div>
        <h3 class="font-semibold mb-2">Your cart is empty</h3>
        <p class="text-base-content/70 text-sm mb-4">
          Add some games to your cart to continue with checkout.
        </p>
        <router-link to="/games" class="btn btn-primary btn-sm">Browse Games</router-link>
      </div>
    </div>
  </div>

  <TermsAndPrivacyModal @agreed="formData.agreeToTermsAndPrivacy = true" />
</template>
