<script setup lang="ts">
interface IBaseIconProps {
  name: string;
  color?: string;
  stroke?: string;
  size?: number;
  width?: number;
  height?: number;
}

withDefaults(defineProps<IBaseIconProps>(), {
  color: '#ffffff',
  size: 16,
});
</script>

<template>
  <svg
    :fill="color"
    :width="(width ? width : size) + 'px'"
    :height="(height ? height : size) + 'px'"
  >
    <use v-bind="{ 'xlink:href': '/images/sprite.svg#' + name }" />
  </svg>
</template>
