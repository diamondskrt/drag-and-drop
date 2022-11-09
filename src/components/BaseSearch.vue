<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  search: string;
  label: string;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:search', value: string): void;
}>();

const isFocused = ref(false);

const onFocus = () => {
  isFocused.value = true;
};

const onBlur = () => {
  isFocused.value = false;
};

const onInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit('update:search', value);
};
</script>

<template>
  <div class="search no-select">
    <div class="input" :class="{ 'input--is-focused': isFocused }">
      <div class="input__control">
        <div class="input__slot">
          <div class="text-field__slot">
            <label
              for="search"
              class="label"
              :class="{ 'label--active': isFocused || search }"
              style="left: 0px; right: auto; position: absolute"
            >
              {{ label }}
            </label>
            <input
              id="search"
              type="text"
              @focus="onFocus"
              @blur="onBlur"
              @input="onInput"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.input {
  align-items: flex-start;
  display: flex;
  flex: 1 1 auto;
  font-size: 16px;
  letter-spacing: normal;
  max-width: 100%;
  text-align: left;

  &--is-focused {
    .input__slot {
      &:after {
        transform: scaleX(1);
      }
    }
  }
}
.input__control {
  display: flex;
  flex-direction: column;
  height: auto;
  flex-grow: 1;
  flex-wrap: wrap;
  min-width: 0;
  width: 100%;
}

.input__slot {
  align-items: center;
  display: flex;
  margin-bottom: 8px;
  min-height: inherit;
  position: relative;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  transition-property: height, min-height;
  width: 100%;

  &:before,
  &:after {
    bottom: -1px;
    content: '';
    left: 0;
    position: absolute;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    width: 100%;
  }

  &:before {
    width: 100%;
    border-color: rgba(255, 255, 255, 0.42);
    border-style: solid;
    border-width: thin 0 0;
  }

  &:after {
    background-color: currentColor;
    border-color: currentcolor;
    border-style: solid;
    border-width: thin 0;
    transform: scaleX(0);
  }
}

.text-field__slot {
  display: flex;
  flex: 1 1 auto;
  position: relative;
}

.label {
  transform-origin: top left;
  color: rgba(255, 255, 255, 0.6);
  height: 20px;
  line-height: 20px;
  letter-spacing: normal;
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  top: 6px;
  white-space: nowrap;
  pointer-events: none;
  font-size: 16px;
  line-height: 1;
  min-height: 8px;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

  &--active {
    max-width: 133%;
    transform: translateY(-18px) scale(0.75);
    pointer-events: auto;
  }
}
</style>
