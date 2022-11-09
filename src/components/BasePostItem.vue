<script setup lang="ts">
import type { IPost } from '@/models/posts';

interface Props {
  post: IPost;
}

defineProps<Props>();
</script>

<template>
  <div class="post-item pa-2">
    <div class="text-subtitle no-select">{{ post.title }}</div>

    <div class="text-body no-select mt-2">{{ post.body }}</div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/colors.scss';
</style>
