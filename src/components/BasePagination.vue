<script setup lang="ts">
import { computed, withDefaults } from 'vue';
import BaseIcon from '@/components/BaseIcon.vue';

interface Props {
  maxVisibleButtons?: string;
  totalPages?: number;
  currentPage: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxVisibleButtons: '10',
  totalPages: 10,
});

const emit = defineEmits<{
  (e: 'pagechanged', page: number): void;
}>();

const isInFirstPage = computed(() => {
  return props.currentPage === 1;
});

const isInLastPage = computed(() => {
  return props.currentPage === props.totalPages;
});

const rangeItems = (from: number, to: number) => {
  const range = [];

  from = from > 0 ? from : 1;

  for (let i = from; i <= to; i++) {
    range.push(i);
  }

  return range;
};

// pagination from vuetify
const pages = () => {
  const totalVisible = parseInt(props.maxVisibleButtons, 10);

  if (
    totalVisible === 0 ||
    isNaN(props.totalPages) ||
    props.totalPages > Number.MAX_SAFE_INTEGER
  ) {
    return [];
  }

  const maxLength = Math.min(
    Math.max(0, totalVisible) || props.totalPages,
    props.totalPages
  );

  if (props.totalPages <= maxLength) {
    return rangeItems(1, props.totalPages);
  }

  const even = maxLength % 2 === 0 ? 1 : 0;
  const left = Math.floor(maxLength / 2);
  const right = props.totalPages - left + 1 + even;

  if (props.currentPage > left && props.currentPage < right) {
    const firstItem = 1;
    const lastItem = props.totalPages;
    const start = props.currentPage - left + 2;
    const end = props.currentPage + left - 2 - even;
    const secondItem = start - 1 === firstItem + 1 ? 2 : '...';
    const beforeLastItem = end + 1 === lastItem - 1 ? end + 1 : '...';

    return [
      1,
      secondItem,
      ...rangeItems(start, end),
      beforeLastItem,
      props.totalPages,
    ];
  } else if (props.currentPage === left) {
    const end = props.currentPage + left - 1 - even;
    return [...rangeItems(1, end), '...', props.totalPages];
  } else if (props.currentPage === right) {
    const start = props.currentPage - left + 1;
    return [1, '...', ...rangeItems(start, props.totalPages)];
  } else {
    return [
      ...rangeItems(1, left),
      '...',
      ...rangeItems(right, props.totalPages),
    ];
  }
};

const onClickPreviousPage = () => {
  emit('pagechanged', props.currentPage - 1);
};

const onClickPage = (page: number) => {
  emit('pagechanged', page);
};

const onClickNextPage = () => {
  emit('pagechanged', props.currentPage + 1);
};
</script>

<template>
  <ul class="d-flex">
    <li>
      <button
        type="button"
        class="icon cursor-pointer"
        :disabled="isInFirstPage"
        @click="onClickPreviousPage"
      >
        <base-icon name="chevron-left" />
      </button>
    </li>

    <li v-for="page in pages()" :key="page">
      <template v-if="typeof page === 'number'">
        <button
          type="button"
          class="cursor-pointer ml-2"
          :class="{ 'bg-primary': page === currentPage }"
          @click="onClickPage(page)"
        >
          {{ page }}
        </button>
      </template>
      <template v-else>
        <button type="button" class="ml-2">
          {{ page }}
        </button>
      </template>
    </li>

    <li>
      <button
        type="button"
        class="icon cursor-pointer ml-2"
        :disabled="isInLastPage"
        @click="onClickNextPage"
      >
        <base-icon name="chevron-left" class="rotated-icon" />
      </button>
    </li>
  </ul>
</template>
