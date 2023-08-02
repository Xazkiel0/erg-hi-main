<script setup>
import { toRefs, computed, ref, watch } from 'vue';

const props = defineProps({
  value: String,
  type: String,
  className: String,
  label: String,
  placeholder: String,
  showErrorMessage: Boolean,
  errorRules: Object,
});
const emit = defineEmits(['update', 'errorChecker']);

const { value, type, className, label, showErrorMessage, errorRules } =
  toRefs(props);
const localValue = ref('');

const errorMessage = computed(() => {
  let msg = '';
  const min = errorRules.value.min ? errorRules.value.min : 0;
  if (errorRules.value.required) {
    if (localValue.value === '') msg += `${label.value} is required <br>`;
  }
  if (min) {
    if (localValue.value.length < min)
      msg += `${label.value} must have more than ${min} characters <br>`;
  }

  return msg;
});

watch(
  () => errorMessage.value,
  (newMessage, oldMessage) => {
    emit('errorChecker', {
      [label.value.toLowerCase()]: {
        isError: !!errorMessage.value,
      },
    });
  },
  { immediate: true }
);

watch(
  () => value.value,
  (newVal, oldVal) => {
    localValue.value = newVal;
  },
  { immediate: true }
);

const lowerCaseLabel = label.value.toLowerCase();

const changeHandler = (e) => {
  emit('update', {
    [label.value.toLowerCase()]: {
      value: e ? e.target.value : value,
    },
  });
};
</script>

<template>
  <div class="flex flex-col">
    <label :for="lowerCaseLabel" class="font-medium text-base">{{
      label
    }}</label>
    <input
      v-if="type !== 'textarea'"
      :type="type"
      :id="lowerCaseLabel"
      class="bg-transparent border-2 border-grey-400 rounded-md py-1 px-2 outline-none"
      :class="className"
      :value="value"
      @keyup="changeHandler"
      :placeholder="placeholder"
    />

    <textarea
      v-else
      :id="lowerCaseLabel"
      class="bg-transparent border-2 border-grey-400 rounded-md py-1 px-2 outline-none"
      :class="className"
      @keyup="changeHandler"
      :value="value"
      :placeholder="placeholder"
      cols="25"
      rows="3"
    ></textarea>

    <span
      class="text-red-500 text-sm"
      v-if="showErrorMessage && errorMessage"
      v-html="errorMessage"
    >
    </span>
  </div>
</template>
