<script setup>
import CarousellItem from './CarousellItem.vue';

import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { useSlideStore } from '../../stores/slides';

const slides = reactive([]);
const currentSlide = ref(0);
const slideInterval = ref(null);
const slideStore = useSlideStore();

onMounted(() => {
  startSlideTimer();
  slideStore.getAll();
});

slideStore.$subscribe((mutation, state) => {
  Object.assign(slides, state.slides)
});

onUnmounted(() => {
  stopSlideTimer();
});

const setCurrentSlide = (index) => {
  currentSlide.value = index;
};
const _next = (step = 1) => {
  const index =
    currentSlide.value < slides.length - 1 ? currentSlide.value + step : 0;
  setCurrentSlide(index);
};
const startSlideTimer = () => {
  stopSlideTimer();
  slideInterval.value = setInterval(() => {
    _next();
  }, 5000);
};
const stopSlideTimer = () => {
  clearInterval(slideInterval);
};
</script>

<template>
  <div class="abosolute w-full h-full">
    <div class="relative h-[35rem] overflow-hidden flex">
      <CarousellItem v-for="(slide, index) in slides" :slide="slide" :key="`item-${index}`" :current-slide="currentSlide"
        :index="index" />
      <div class="relative w-full p-4 md:w-3/4 md:p-12 lg:p-18 z-10 flex justify-center items-start flex grow flex-col">
        <slot />
      </div>
    </div>
  </div>
</template>
