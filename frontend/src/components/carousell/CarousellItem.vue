<script setup>
import { ref, toRefs } from 'vue';
import ImageDeta from '../ImageDeta.vue';

const props = defineProps({
  slide: String,
  currentSlide: Number,
  index: Number,
});

const { slide } = toRefs(props);

</script>

<template>
  <transition name="slide-in">
    <div class="absolute inset w-full h-[35rem] bg-gray-900" v-show="currentSlide === index">
      <ImageDeta :filename="slide" class="w-full h-full object-cover" style="opacity: 0.5;"/>
    </div>
  </transition>
</template>

<style scoped>
.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 1s ease-in-out;
}

.slide-in-enter-from {
  transform: translateX(-100%);
  /* opacity: 0; */
}

.slide-in-leave-to {
  /* opacity: 1; */
  transform: translateX(100%);
}
</style>
