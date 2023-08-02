<script setup>
import { toRefs } from 'vue';

const props = defineProps({
  label: String,
  link: String,
});

const { label, link } = toRefs(props);
</script>

<template>
  <div class="text-grey-800">
    <span>{{ label }}</span>
    :
    <a :href="link" target="_blank" class="text-blue-700">
      <slot />
    </a>
  </div>
</template>
