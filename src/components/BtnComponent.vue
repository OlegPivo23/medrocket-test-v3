<template>
  <div class="btn-wrapper">
    <button @click="activateEmit" class="btn">
      <span class="btn-text"><slot /></span>
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['emit-btn'])

function activateEmit() {
  emit('emit-btn')
}
</script>

<style lang="scss" scoped>
.btn {
  padding: 16px 32px;
  // background: #edf9ff;
  background-color: #fff;
  border: none;
  max-width: 372px;
  width: 100%;
  cursor: pointer;
}
.btn-text {
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 18px;
  line-height: 130%;
  color: #117dc1;
}
</style>
