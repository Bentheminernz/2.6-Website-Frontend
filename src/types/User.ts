import type { BasicCartItemGame, BasicGame, Game } from './Game'

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  cart_items: BasicCartItem[]
  cart_subtotal: number
}

export interface BasicCartItem {
  id: number
  game_id: number
}

export interface CartItem {
  id: number
  game: BasicGame
  quantity: number
  added_date: string
}

export interface UserCart {
  cart_items: CartItem[]
  cart_subtotal: number
}
