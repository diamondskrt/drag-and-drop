<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, inject } from 'vue';
import type { Axios } from 'axios';
import BaseLoader from '@/components/BaseLoader.vue';
import BasePagination from '@/components/BasePagination.vue';
import BaseSearch from '@/components/BaseSearch.vue';
import BasePostItem from '@/components/BasePostItem.vue';
import { usePostsStore } from '@/stores/posts';
import type { IPost } from '@/models/posts';

const axios: Axios | undefined = inject('axios');

const postStore = usePostsStore();

const search = ref('');

const posts = ref<IPost[]>([]);

const chunkSize = 10;

const postLoading = ref(false);

const chunk = (array: IPost[], size: number) => {
  const chunkedArray = [];
  for (var i = 0; i < array.length; i += size) {
    chunkedArray.push(array.slice(i, i + size));
  }
  return chunkedArray;
};

const getChunkedArrayLength = computed(() => {
  const dragListIds = postStore.dragList.map((post) => post.id);
  return chunk(
    posts.value.filter((post: IPost) => !dragListIds.includes(post.id)),
    chunkSize
  )?.length;
});

const getCurrentPageArray = computed(() => {
  const dragListIds = postStore.dragList.map((post) => post.id);

  return chunk(
    posts.value.filter((post: IPost) => !dragListIds.includes(post.id)),
    chunkSize
  )[postStore.currentPage - 1];
});

const getPosts = computed(() => {
  return search.value ? posts.value : getCurrentPageArray.value;
});

const onPageChange = (page: number) => {
  postStore.pageChange(page);
};

const loadPosts = async () => {
  if (axios) {
    try {
      postLoading.value = true;

      posts.value = await axios.get('/posts');
    } catch (error) {
      console.log(error);
    } finally {
      postLoading.value = false;
    }
  }
};

onMounted(() => loadPosts());

let timeout: number | undefined;

const debounce = (value: string, ms: number) => {
  if (axios) {
    const fnCall = async () => {
      try {
        posts.value = await axios.get('/posts', {
          params: {
            title_like: value,
          },
        });
      } catch (error) {
        console.log(error);
      }
    };

    clearTimeout(timeout);

    timeout = setTimeout(fnCall, ms);
  }
};

watch(search, (value: string) => {
  debounce(value, 500);
});

onUnmounted(() => {
  if (timeout) {
    clearTimeout(timeout);
  }
});

const startDrag = (event: DragEvent, post: IPost) => {
  event.dataTransfer?.setData('itemId', `${post.id}`);
};

const onDrop = (event: DragEvent) => {
  const parentElement = (event.target as HTMLInputElement).parentElement;
  const targetElement = event.target as HTMLInputElement;
  const itemId = event.dataTransfer?.getData('itemId');

  const foundPost = posts.value.find((post) => post.id === Number(itemId));

  const foundPostFromDragList = postStore.dragList.find(
    (post) => post.id === Number(itemId)
  );

  const droppablePostId = Number(
    parentElement?.dataset.id || targetElement?.dataset.id
  );

  if (foundPost) {
    if (!foundPostFromDragList) {
      postStore.setDragList(foundPost);
    } else {
      if (droppablePostId) {
        const droppablePostIndex = postStore.dragList
          .map((post) => post.id)
          .indexOf(droppablePostId);

        const draggablePostIndex = postStore.dragList
          .map((post) => post.id)
          .indexOf(Number(itemId));

        postStore.changeDragList(draggablePostIndex, droppablePostIndex);
      }
    }
  }
};
</script>

<template>
  <div class="mt-4">
    <div class="container container--fluid">
      <div class="row">
        <div class="col-md-6 col-12">
          <base-search label="Поиск" v-model:search="search" />

          <base-loader v-if="postLoading" />

          <template v-else>
            <div v-if="getPosts && getPosts.length" class="posts mt-2">
              <base-post-item
                v-for="(post, index) in getPosts"
                :key="post.id"
                :post="post"
                class="bg-primary rounded cursor-grab"
                :class="{ 'mt-2': index !== 0 }"
                draggable="true"
                @dragstart="startDrag($event, post)"
              />

              <base-pagination
                v-if="!search"
                :current-page="postStore.currentPage"
                :total-pages="getChunkedArrayLength"
                :max-visible-buttons="`${getChunkedArrayLength}`"
                class="mt-6"
                @pagechanged="onPageChange"
              />
            </div>
            <div v-else>Ничего не найдено</div>
          </template>
        </div>

        <div class="col-md-6 col-12">
          <div class="drag-and-drop">
            <h6 class="text-h6 text-center no-select">Drop Zone</h6>
            <div
              class="drag-and-drop__zone bg-primary rounded fill-height mt-4 pa-2"
              @dragover.prevent
              @dragenter.prevent
              @drop="onDrop($event)"
            >
              <template v-if="postStore.dragList.length">
                <base-post-item
                  v-for="(post, index) in postStore.dragList"
                  :key="post.id"
                  :post="post"
                  :data-id="post.id"
                  class="bg-dark rounded cursor-grab"
                  :class="{ 'mt-2': index !== 0 }"
                  draggable="true"
                  @dragstart="startDrag($event, post)"
                />
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.drag-and-drop {
  display: flex;
  flex-direction: column;
  min-height: 400px;

  &__zone {
    flex-grow: 1;
  }
}
</style>
