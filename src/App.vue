<script setup lang="ts">
import BasePosts from '@/components/BasePosts.vue';
</script>

<template>
  <header>
    <h6 class="logo text-h6 no-select">jsonplaceholder</h6>
  </header>

  <main>
    <base-posts />
  </main>
</template>

<style scoped lang="scss">
header {
  position: absolute;
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  line-height: 1.5;
  background-color: var(--vt-c-black);
  box-shadow: 0 2px 4px -1px rgb(0 0 0 / 20%), 0 4px 5px 0 rgb(0 0 0 / 14%),
    0 1px 10px 0 rgb(0 0 0 / 12%);
  z-index: 1;

  .logo {
    margin-left: 1rem;
  }
}

main {
  padding-top: 60px;
}
</style>
