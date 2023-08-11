<template>
  <img :src="img" :alt="altProp" :class="classProp" :style="style" />
</template>

<script setup>
import { ref, toRefs, watch } from 'vue';
import { get_image } from '../utils';

const props = defineProps({
  filename: String,
  altProp: String,
  classProp: String,
  style: String,
});

const { filename, altProp, classProp, style } = toRefs(props);

const img = ref('');

watch(
  filename.value,
  async (newVal) => {
    await tryLoadImage();
  },
  { immediate: true }
);

async function tryLoadImage() {
  try {
    img.value = URL.createObjectURL(await get_image(filename.value));
  } catch (e) {
    console.warn('ImageDeta: could not load image', filename.value);
  }
}
</script>
