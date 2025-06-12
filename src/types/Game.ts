export interface BasicGame {
  id: number
  title: string
  description: string
  price: number
  image: string
}

export interface BasicCartItemGame {
  id: number
}

export enum GameGenre {
  ACTION = "Action",
  ADVENTURE = "Adventure",
  RPG = "Role-Playing Game",
  SHOOTER = "Shooter",
  SPORTS = "Sports",
  RACING = "Racing",
  PUZZLE = "Puzzle",
  STRATEGY = "Strategy",
  SIMULATION = "Simulation",
  FIGHTING = "Fighting",
  PLATFORMER = "Platformer",
  HORROR = "Horror",
  MMO = "Massively Multiplayer Online",
  SANDBOX = "Sandbox",
  STEALTH = "Stealth",
  MUSIC = "Music/Rhythm",
  PARTY = "Party",
  SURVIVAL = "Survival",
  VISUAL_NOVEL = "Visual Novel",
  INDIE = "Indie"
}

export enum GamePlatform {
  PC = "PC",
  MAC = "Mac",
  PS4 = "PlayStation 4",
  PS5 = "PlayStation 5",
  XBOX_ONE = "Xbox One",
  XBOX_SERIES = "Xbox Series X/S",
  SWITCH = "Nintendo Switch",
  SWITCH2 = "Nintendo Switch 2"
}

export interface PlatformObject {
  id: number
  name: keyof typeof GamePlatform
}

export interface GenreObject {
  id: number
  name: keyof typeof GameGenre
}

export interface Game extends BasicGame {
  developer: string
  publisher: string
  release_date: string
  trailer_url?: string
  platforms?: PlatformObject[]
  genres?: GenreObject[]
  is_sale: boolean
  sale_price?: number
  sale_start_date?: string
  sale_end_date?: string
}
