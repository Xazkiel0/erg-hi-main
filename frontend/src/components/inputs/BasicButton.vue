<script setup>
import { toRefs } from 'vue';

const props = defineProps({
  className: String,
  isLink: Boolean,
  link: String,
});
const emit = defineEmits(['click']);

const { className, link } = toRefs(props);

const clicked = () => {
  emit('click');
};
</script>

<template>
  <button
    class="p-3 rounded-md flex items-center gap-2"
    :class="className"
    @click="clicked"
    v-if="!isLink"
  >
    <slot />
  </button>
  <router-link
    class="p-3 rounded-md text-grey-200 flex items-center gap-2"
    :class="className"
    :to="link"
    v-else
  >
    <slot />
  </router-link>
</template>
