<template>
  <section class="favorite">
    <div class="favorite__wrapper">
      <div v-if="favoritePhotos.length === 0" class="empty-wrapper">
        <img src="/public/images/static/empty.png" alt="Empty List" />
        <div class="favorite__text-wrapper">
          <h2 class="favorite__title">Список избранного пуст</h2>
          <p class="favorite__text">
            Добавляйте изображения, нажимая на звездочки
          </p>
        </div>
      </div>

      <div v-else class="favorite__photos">
        <div
          v-for="(photo, index) in favoritePhotos"
          :key="photo.id"
          class="favorite__photo-item"
        >
          <div class="favorite__photo-item-content">
            <img
              :src="photo.url"
              :alt="photo.title"
              class="favorite__photo-image"
            />
            <p>{{ photo.title }}</p>
          </div>

          <div class="favorite-btn" @click="toggleFavorite(photo.id)">
            <img
              v-if="isPhotoFavorite(photo.id)"
              src="/public/images/static/star_active.png"
              alt="Active Star"
            />
            <img
              v-else
              src="/public/images/static/star_empty.png"
              alt="Empty Star"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useFavStore } from '@/stores/favoriteStore'
import { computed, onMounted } from 'vue'
import type { Photo } from '@/types'

const favStore = useFavStore()

const favoritePhotos = computed<Photo[]>(() => favStore.getFavoritePhoto)

const isPhotoFavorite = (photoId: number): boolean => {
  return favStore.isFavorite(photoId)
}

const toggleFavorite = (photoId: number): void => {
  if (favStore.isFavorite(photoId)) {
    favStore.removeFavoritePhoto(photoId)
  } else {
    favStore.addFavoritePhoto(photoId)
  }
}

onMounted(() => {
  favStore.loadFavorites()
})
</script>

<style scoped lang="scss">
.favorite__wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-wrapper {
  text-align: center;
}

.favorite__title {
  font-size: 24px;
  margin-top: 16px;
}

.favorite__text {
  font-size: 16px;
  margin-top: 8px;
}

.favorite__photos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 42px;
  margin-top: 56px;
}

.favorite__photo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.favorite__photo-item-content{
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: min-content;
}

.favorite__photo-image {
  width: 150px;
  height: auto;
  border-radius: 8px;
}

.favorite-btn {
  cursor: pointer;
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>
