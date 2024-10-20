import { defineStore } from 'pinia'
import axios from 'axios'
import type { PhotoStoreState, User, Album, Photo } from '@/types/entities'

export const usePhotoStore = defineStore<'photoStore', PhotoStoreState>({
  id: 'photoStore',
  state: (): PhotoStoreState => ({
    users: [],
    albums: [],
    photos: [],
    selectedUser: null,
    selectedAlbum: null,
    fullSizePhoto: null,
  }),
  getters: {
    getUsers(state): User[] {
      return state.users
    },
    getAlbums(state): Album[] {
      return state.albums
    },
    getPhotos(state): Photo[] {
      return state.photos
    },
  },
  actions: {
    async loadUsers() {
      try {
        const response = await axios.get<User[]>(
          'https://json.medrocket.ru/users/',
        )
        this.users = response.data
        console.log(this.users)
      } catch (error) {
        console.error('Ошибка загрузки пользователей:', error)
      }
    },
    async loadAlbums(userId: number) {
      try {
        const response = await axios.get<Album[]>(
          `https://json.medrocket.ru/albums?userId=${userId}`,
        )
        this.albums = response.data
        this.selectedUser = userId
      } catch (error) {
        console.error('Ошибка загрузки альбомов:', error)
      }
    },
    async loadPhotos(albumId: number) {
      try {
        const response = await axios.get<Photo[]>(
          `https://json.medrocket.ru/photos?albumId=${albumId}`,
        )
        this.photos = response.data
        this.selectedAlbum = albumId
      } catch (error) {
        console.error('Ошибка загрузки фотографий:', error)
      }
    },
    showFullSize(photoUrl: string) {
      this.fullSizePhoto = photoUrl
    },
  },
})
