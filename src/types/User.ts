import type { Game } from './Game'

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  cart_items: CartItem[]
}

export interface CartItem {
  id: number
  game: Game
  quantity: number
  added_date: string
}
