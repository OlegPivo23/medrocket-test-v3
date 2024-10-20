<script setup lang="ts">
import HeaderComponent from '@/components/HeaderComponent.vue'
</script>

<template>
  <div class="wrapper">
    <HeaderComponent />
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  max-width: 1152px;
  margin: 0 auto;
  padding: 64px 204px;
  box-sizing: border-box;
  display: grid;
  gap: 16px;
}
</style>
