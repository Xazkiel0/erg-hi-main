<script setup>
const props = defineProps({
  withButton: Boolean,
});
</script>

<template>
  <div class="flex justify-between">
    <div class="flex items-center gap-2">
      <div class="bg-grey-100 p-2 rounded-full">
        <slot name="icon" />
      </div>
      <h1 class="text-2xl text-grey-900 font-semibold">
        <slot />
      </h1>
    </div>
    <div class="flex gap-2" v-if="withButton">
      <slot name="buttons" />
    </div>
  </div>
</template>
