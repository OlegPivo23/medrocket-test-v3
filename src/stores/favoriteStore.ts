import { defineStore } from 'pinia'
import type { FavStoreState, Photo } from '@/types/entities'

export const useFavStore = defineStore<'favStore', FavStoreState>({
  id: 'favStore',
  state: (): FavStoreState => ({
    favoritePhoto: JSON.parse(
      localStorage.getItem('favoritePhoto') || '[]',
    ) as Photo[],
  }),
  getters: {
    getFavoritePhoto(state): Photo[] {
      return state.favoritePhoto
    },
    isFavorite:
      state =>
      (photoId: number): boolean => {
        return state.favoritePhoto.some(photo => photo.id === photoId)
      },
  },
  actions: {
    addFavoritePhoto(photo: Photo) {
      if (!this.isFavorite(photo.id)) {
        this.favoritePhoto.push(photo)
        localStorage.setItem(
          'favoritePhoto',
          JSON.stringify(this.favoritePhoto),
        )
      }
    },
    removeFavoritePhoto(photoId: number) {
      this.favoritePhoto = this.favoritePhoto.filter(
        photo => photo.id !== photoId,
      )
      localStorage.setItem('favoritePhoto', JSON.stringify(this.favoritePhoto))
    },
    loadFavorites() {
      this.favoritePhoto = JSON.parse(
        localStorage.getItem('favoritePhoto') || '[]',
      ) as Photo[]
    },
    toggleFavorite(photo: Photo) {
      if (this.isFavorite(photo.id)) {
        this.removeFavoritePhoto(photo.id)
      } else {
        this.addFavoritePhoto(photo)
      }
    },
  },
})
