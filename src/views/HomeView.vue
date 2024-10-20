<template>
  <section class="home">
    <div class="loader" v-if="loading">
      <img src="/public/images/static/loader.gif" alt="Loading..." />
    </div>
    <div class="home__wrapper" v-else>
      <nav class="home__nav">
        <ul class="home__list">
          <li v-for="user in users" :key="user.id" class="home__list-item">
            <button class="home__item-btn" @click="loadAlbums(user.id)">
              <img
                v-if="activeAlbums[user.id]"
                src="/images/home/close-btn.svg"
                alt="Close"
              />
              <img v-else src="/images/home/open-btn.svg" alt="Open" />
            </button>
            <p class="home__item-text">{{ user.name }}</p>
            <div>
              <ul
                class="home__list home__list--sublist"
                v-if="activeAlbums[user.id]"
              >
                <li
                  v-for="album in activeAlbums[user.id]"
                  :key="album.id"
                  class="home__list-item home__list-item--subitem"
                >
                  <button
                    @click="showPhotos(album.id, user.id)"
                    class="home__item-btn"
                  >
                    <img
                      v-if="
                        albumImages[user.id] && albumImages[user.id][album.id]
                      "
                      src="/images/home/close-btn.svg"
                      alt="Close"
                    />
                    <img v-else src="/images/home/open-btn.svg" alt="Open" />
                  </button>
                  <p class="home__item-text home__item--subtext">
                    {{ album.title }}
                  </p>
                  <div
                    v-if="
                      albumImages[user.id] && albumImages[user.id][album.id]
                    "
                    class="album-wrapper"
                  >
                    <div
                      v-for="(image, imgIndex) in albumImages[user.id][
                        album.id
                      ].slice(0, 10)"
                      :key="imgIndex"
                      class="album-image-container"
                      @mouseenter="showTooltip(image.title, $event)"
                      @mousemove="moveTooltip($event)"
                      @mouseleave="hideTooltip"
                    >
                      <img
                        :src="image.url"
                        alt="Album Image"
                        class="album-image"
                        @click="openFullScreenImage(image)"
                      />
                      <div
                        v-if="isTooltipVisible && tooltipText === image.title"
                        class="custom-tooltip"
                        :style="tooltipStyles"
                      >
                        {{ tooltipText }}
                      </div>
                      <div
                        class="favorite-btn"
                        @click="toggleFavorite(image, user.id, album.id)"
                      >
                        <img
                          v-if="image.isFavorite"
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
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
      <Teleport to="body">
        <FullScreenComponent
          :image="selectedImage"
          :isOpen="isFullScreenOpen"
          @close="closeFullScreen"
        />
      </Teleport>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFavStore } from '@/stores/favoriteStore'
import { usePhotoStore } from '@/stores/photoStore'
import type { Photo, Album, User } from '@/types/entities'
import FullScreenComponent from '@/components/FullScreenComponent.vue'

const selectedImage = ref<{ url: string } | null>(null)
const isFullScreenOpen = ref<boolean>(false)
const photoStore = usePhotoStore()
const activeAlbums = ref<Record<number, Album[]>>({})
const albumImages = ref<Record<number, Record<number, Photo[]>>>({})
const loading = ref<boolean>(false)

const isTooltipVisible = ref(false)
const tooltipText = ref('')
const tooltipStyles = ref({
  top: '0px',
  left: '0px',
})

const users = computed<User[]>(() => photoStore.getUsers)
const albums = computed<Album[]>(() => photoStore.getAlbums)
const photos = computed<Photo[]>(() => photoStore.getPhotos)

const favStore = useFavStore()

async function loadAlbums(userId: number): Promise<void> {
  loading.value = true
  try {
    if (!activeAlbums.value[userId]) {
      await photoStore.loadAlbums(userId)
      activeAlbums.value[userId] = albums.value
    } else {
      delete activeAlbums.value[userId]
      delete albumImages.value[userId]
    }
  } finally {
    loading.value = false
  }
}

async function showPhotos(albumId: number, userId: number): Promise<void> {
  loading.value = true
  try {
    albumImages.value[userId] = albumImages.value[userId] || {}
    if (!albumImages.value[userId][albumId]) {
      await photoStore.loadPhotos(albumId)
      albumImages.value[userId][albumId] = photos.value.map(photo => ({
        ...photo,
        isFavorite: favStore.isFavorite(photo.id),
      }))
    } else {
      delete albumImages.value[userId][albumId]
    }
  } finally {
    loading.value = false
  }
}

function toggleFavorite(photo: Photo, userId: number, albumId: number): void {
  const photoIndex = albumImages.value[userId][albumId].findIndex(
    p => p.id === photo.id,
  )

  if (photoIndex !== -1) {
    const isFavorite = favStore.isFavorite(photo.id)

    if (isFavorite) {
      favStore.removeFavoritePhoto(photo.id)
    } else {
      favStore.addFavoritePhoto(photo)
    }

    albumImages.value[userId][albumId][photoIndex].isFavorite = !isFavorite
  }
}

function openFullScreenImage(image: Photo): void {
  selectedImage.value = image
  isFullScreenOpen.value = true
}

function closeFullScreen(): void {
  isFullScreenOpen.value = false
  selectedImage.value = null
}

function showTooltip(text: string, event: MouseEvent) {
  tooltipText.value = text
  isTooltipVisible.value = true
  moveTooltip(event)
}

function hideTooltip() {
  isTooltipVisible.value = false
}

function moveTooltip(event: MouseEvent) {
  tooltipStyles.value = {
    top: `${event.clientY + 15}px`,
    left: `${event.clientX + 0}px`,
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await photoStore.loadUsers()
    favStore.loadFavorites()
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.home__nav {
  display: grid;
  gap: 48px;
}

.home__list {
  &--sublist {
    padding-left: 56px;
  }
}

.home__list-item {
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.home__item-btn {
  background-color: none;
  border: none;
  cursor: pointer;
  border-radius: 100%;
}

.home__item-text {
  font-family: var(--font-family);
  font-weight: 500;
  font-size: 22px;
  line-height: 130%;
  color: #1c1c1c;

  &--subtext {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 18px;
    line-height: 130%;
    color: #1c1c1c;
  }
}

.album-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 42px;
}

.album-image-container {
  position: relative;
  display: inline-block;
}

.album-image {
  width: 150px;
  height: 150px;
  cursor: pointer;
  border-radius: 4px;
}

.favorite-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
}

.favorite-btn img {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

/* Custom Tooltip styles */
.custom-tooltip {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 3;
}
</style>
