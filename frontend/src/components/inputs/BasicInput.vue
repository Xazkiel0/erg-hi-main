<script setup>
import { toRefs } from 'vue';

const props = defineProps({
  value: String,
  type: String,
  className: String,
});
const emit = defineEmits(['update']);

const { value, type, className } = toRefs(props);

const changeHandler = (e) => {
  emit('update', e.target.value);
};
</script>

<template>
  <input
    :type="type"
    class="bg-transparent border-2 border-grey-400 rounded-md py-1 px-2 outline-none"
    :class="className"
    :value="value"
    @keyup="changeHandler"
  />
</template>
