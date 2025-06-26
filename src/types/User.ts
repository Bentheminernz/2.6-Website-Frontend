import type { Game } from './Game'

export interface Address {
  id?: number
  street_address: string
  suburb: string
  city: string
  postcode: string
  country: string
}

export interface CardDetails {
  id?: number
  cardNumber: string
  expiryDate: string
  cvv: string
  nameOnCard: string
}

export interface CheckoutFormData {
  firstName: string
  lastName: string
  email: string
  address: Address
  cardDetails: CardDetails
  agreeToTermsAndPrivacy: boolean
  saveCard: boolean
  saveAddress: boolean
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  cart_items: BasicCartItem[]
  cart_subtotal: number
  credit_cards: CardDetails[]
  addresses: Address[]
}

export interface BasicCartItem {
  id: number
  game_id: number
}

export interface CartItem {
  id: number
  game: Game
  quantity: number
  added_date: string
}

export interface UserCart {
  cart_items: CartItem[]
  cart_subtotal: number
}

export interface OwnedGame {
  id: number
  game: Game
  purchase_date: string
}
