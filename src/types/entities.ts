export interface Photo {
  id: number
  url: string
  title: string
  albumId?: number
  thumbnailUrl?: string
  isFavorite?: boolean
}

export interface FavStoreState {
  favoritePhoto: Photo[]
}

export interface User {
  id: number
  name: string
  username: string
  email: string
}

export interface Album {
  id: number
  title: string
  userId: number
}

export interface PhotoStoreState {
  users: User[]
  albums: Album[]
  photos: Photo[]
  selectedUser: number | null
  selectedAlbum: number | null
  fullSizePhoto: string | null
}
