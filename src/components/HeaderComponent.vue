<template>
  <div class="home__btns-wrapper">
    <BtnComponent
      :class="{ active: isActiveRoute('/') }"
      @emit-btn="$router.push('/')"
    >
      Каталог
    </BtnComponent>
    <BtnComponent
      :class="{ active: isActiveRoute('/favorite') }"
      @emit-btn="$router.push('/favorite')"
    >
      Избранное
    </BtnComponent>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import BtnComponent from './BtnComponent.vue'

const route = useRoute()

const isActiveRoute = (path: string) => {
  return route.path === path
}
</script>

<style lang="scss" scoped>
.home__btns-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.active :deep(.btn) {
  background-color: #eef9ff;
  border-radius: 16px;
}
</style>
