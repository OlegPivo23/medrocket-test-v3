<template>
  <div class="fullscreen-modal" v-if="isOpen" @click="close">
    <div class="fullscreen-modal__close-btn" @click="close">
      <img src="/images/fullScreen/close-btn.svg" alt="" />
    </div>
    <div class="img-wrapper" @click.stop>
      <img :src="image.url" alt="Full Screen Image" class="fullscreen-image" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { defineProps, defineEmits } from 'vue'

defineProps<{
  image: { url: string } | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const close = () => {
  emit('close')
}

const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscKey)
})
</script>

<style scoped>
.fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.fullscreen-modal__close-btn {
  position: absolute;
  top: 32px;
  right: 40px;
  cursor: pointer;
}
.fullscreen-image {
  max-width: 90%;
  max-height: 90%;
}
</style>
