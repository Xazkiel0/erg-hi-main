<script setup>
import InputWithLabel from '../components/inputs/InputWithLabel.vue';
import { reactive, ref, computed } from 'vue';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();

const isSubmited = ref(false);
const error = ref('');

const credentials = reactive({
  email: { value: '', isError: false, rules: { required: true } },
  password: { value: '', isError: false, rules: { required: true } },
});

const isCorrect = computed(() => {
  return !credentials.email.isError && !credentials.password.isError;
});

const login = () => {
  isSubmited.value = true;
  if (isCorrect.value) {
    userStore.login({
      username: credentials.email.value,
      password: credentials.password.value,
    });
  }
};

userStore.$subscribe((mutation, state) => {
  error.value = state.error;
});

const errorChecker = (payload) => {
  Object.keys(payload).forEach((payloadKey) => {
    Object.keys(credentials).forEach((key) => {
      if (key == payloadKey) {
        credentials[key].isError = payload[key].isError;
      }
    });
  });
};

const update = (payload) => {
  Object.keys(payload).forEach((payloadKey) => {
    Object.keys(credentials).forEach((key) => {
      if (key == payloadKey) {
        credentials[key].value = payload[key].value;
      }
    });
  });
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center container mx-auto min-h-screen gap-4"
  >
    <div>
      <h1 class="text-2xl text-grey-900 font-semibold">
        ERG Health Information
      </h1>
    </div>
    <div class="bg-grey-50 p-8 rounded-md">
      <form class="flex flex-col items-center gap-4" @submit.prevent="login">
        <h2 class="text-xl text-grey-800 font-medium">Login</h2>
        <div class="flex flex-col gap-2">
          <span
            class="bg-red-50 border border-red-400 px-3 py-2 rounded-md text-center"
            v-if="error"
          >
            {{ error }}
          </span>
          <input-with-label
            label="Email"
            class-name="w-72"
            :show-error-message="isSubmited"
            :error-rules="credentials.email.rules"
            :value="credentials.email.value"
            @errorChecker="errorChecker"
            @update="update"
          />
          <input-with-label
            label="Password"
            type="password"
            class-name="w-72"
            :show-error-message="isSubmited"
            :error-rules="credentials.password.rules"
            :value="credentials.password.value"
            @errorChecker="errorChecker"
            @update="update"
          />
        </div>
        <button
          type="submit"
          class="bg-brand-400 px-3 py-1 w-full rounded-md text-grey-100 transition duration-300 hover:bg-brand-500 hover:text-grey-50"
        >
          Login
        </button>
      </form>
    </div>
    <span class="text-grey-500 text-sm"> &copy; 2023 ERG - HI </span>
  </div>
</template>
