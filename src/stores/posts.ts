import { ref } from 'vue';
import { defineStore } from 'pinia';
import { loadState, saveState } from '@/utils/persistedState';
import type { IPost } from '@/models/posts';

export const usePostsStore = defineStore('posts', () => {
  const currentPage = ref(loadState<number>('currentPage') || 1);

  const pageChange = (page: number) => {
    currentPage.value = page;
    saveState('currentPage', currentPage.value);
  };

  const dragList = ref<IPost[]>(loadState<IPost[]>('dragList') || []);

  const setDragList = (post: IPost) => {
    dragList.value.push(post);
    saveState('dragList', dragList.value);
  };

  const changeDragList = (
    draggablePostIndex: number,
    droppablePostIndex: number
  ) => {
    dragList.value[droppablePostIndex] = dragList.value.splice(
      draggablePostIndex,
      1,
      dragList.value[droppablePostIndex]
    )[0];

    saveState('dragList', dragList.value);
  };

  return { currentPage, pageChange, dragList, setDragList, changeDragList };
});
