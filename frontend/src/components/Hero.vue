<script setup>
import Carousell from './carousell/Carousell.vue';
import { toRefs, reactive } from 'vue';

const props = defineProps({
  image: String,
});

const { image } = toRefs(props);
</script>

<template>
  <div id="hero" class="w-full relative flex flex-col h-[35rem]">
    <Carousell>
      <slot />
    </Carousell>
  </div>
</template>
