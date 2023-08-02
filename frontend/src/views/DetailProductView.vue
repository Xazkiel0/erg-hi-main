<script setup>
import LinkWithLabel from '../components/LinkWithLabel.vue';

import { onMounted, reactive, ref } from 'vue';

import { useProductStore } from '../stores/product';
import { useRoute } from 'vue-router';

import { env } from '../utils'
import ImageDeta from '../components/ImageDeta.vue';

const productStore = useProductStore();
const route = useRoute();
const product = reactive({});
const baseUrl = ref(env.api_url);

const { productId } = route.params;

onMounted(() => {
  productStore.getOneById({ id: productId });
});

productStore.$subscribe((mutation, state) => {
  Object.assign(product, state.product);
});
</script>

<template>
  <div
    class="mt-24 container w-full flex flex-col md:flex-row md:gap-4 md:px-4 lg:gap-0"
  >
    <div class="md:basis-1/2 flex justify-center">
      <ImageDeta :filename="product.filename" :alt-prop="product.title" class-prop="w-60 h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover rounded-md" v-if="product.filename" />
      <div
        class="w-60 h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-grey-500 rounded-md"
        v-else
      ></div>
    </div>
    <div class="px-8 pt-8 md:p-0 md:basis-1/2 flex flex-col items-start">
      <h1 class="text-2xl text-ellipsis line-clamp-2 font-medium text-grey-900">
        {{ product.title }}
      </h1>
      <div class="mt-5">
        <table>
          <tr class="text-grey-800">
            <td>Author</td>
            <td class="font-medium">: {{ product.author }}</td>
          </tr>
          <tr class="text-grey-800">
            <td>Demo</td>
            <td>: <a :href="product.demo_link" target="_blank" class="text-blue-700">visit here</a></td>
          </tr>
          <tr class="text-grey-800">
            <td>Journal</td>
            <td>: <a :href="product.journal_link" target="_blank" class="text-blue-700">visit here</a></td>
          </tr>
          <tr class="text-grey-800">
            <td>Video</td>
            <td>: <a :href="product.video_link" target="_blank" class="text-blue-700">visit here</a></td>
          </tr>
        </table>
      </div>
      <div class="flex flex-col gap-2">
        <div class="text-grey-800">
          <span>Description</span>:
          <p class="text-grey-900">
            {{ product.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
