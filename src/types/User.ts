import type { Game } from './Game'

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
