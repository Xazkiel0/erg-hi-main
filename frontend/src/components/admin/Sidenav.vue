<script setup>
import { toRefs } from 'vue';
const props = defineProps({
  open: Boolean,
});

const { open } = toRefs(props);
</script>

<template>
  <div
    class="transition-all duration-300 bg-grey-50 min-w-[14rem] flex flex-col items-center rounded-2xl overflow-hidden h-screen max-h-[calc(100vh-1rem)] lg:m-0"
    :class="{ '-ml-[14.5rem]': !open }"
  >
    <div class="h-12 flex items-center">
      <h1 class="text-2xl font-medium text-grey-900 py-2">ERG - HI</h1>
    </div>
    <div class="flex-1 w-full px-6 py-4 flex flex-col gap-4">
      <slot name="menus" />
    </div>
    <slot name="bottom-menu" />
  </div>
</template>
