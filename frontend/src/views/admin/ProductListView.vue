<script setup>
import ProductIcon from '../../components/icons/ProductIcon.vue';
import PlusIcon from '../../components/icons/PlusIcon.vue';
import SearchIcon from '../../components/icons/SearchIcon.vue';
import ChevronRightIcon from '../../components/icons/ChevronRightIcon.vue';
import ChevronLeftIcon from '../../components/icons/ChevronLeftIcon.vue';
import SectionTitle from '../../components/admin/SectionTitle.vue';
import BasicButton from '../../components/inputs/BasicButton.vue';
import BasicInput from '../../components/inputs/BasicInput.vue';

import { useProductStore } from '../../stores/product';
import { reactive, ref, onMounted, computed } from 'vue';

const productStore = useProductStore();

const searchQuery = ref('');
const pageCount = ref(1);
const isSearched = ref(false);
const productHasMore = ref(true);

const products = reactive([]);
const productsBackup = reactive([]);
const tfIdf = reactive({});

onMounted(() => {
  productStore.$reset();
  productStore.getSome(pageCount.value, true);
});

productStore.$subscribe((mutation, state) => {
  Object.assign(products, state.products);
  Object.assign(tfIdf, state.tdidf);

  productHasMore.value = state.hasMore;

  if (isSearched.value) {
    productHasMore.value = true;
    products.sort((a, b) => {
      const productA = tfIdf[a.id];
      const productB = tfIdf[b.id];

      return productB - productA;
    });

    Object.assign(productsBackup, products);

    products.length = 0;
    products.push(...paginateItems.value);
  }
});

const update = (payload) => {
  searchQuery.value = payload;
};

const search = () => {
  const query = searchQuery.value.trim();
  if (query == '') {
    isSearched.value = true;
    products.length = 0;
    pageCount.value = 1;
    productStore.getSome(pageCount.value, true);
  } else {
    isSearched.value = true;
    pageCount.value = 1;
    productStore.getAll();
    productStore.getTfIdf({ query });
  }
};

const truncate = (string, n) => {
  return string?.length > n ? string.substring(0, n - 1) + '...' : string;
};

const paginateItems = computed(() => {
  const pageSize = 3;
  const startIndex = (pageCount.value - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = productsBackup.slice(startIndex, endIndex);
  return paginatedItems;
});

const isHasMore = computed(() => {
  return 3 * pageCount.value < productsBackup.length;
});

const next = () => {
  products.length = 0;
  pageCount.value = pageCount.value + 1;
  if (!isSearched.value) {
    productStore.getSome(pageCount.value, true);
  } else {
    products.push(...paginateItems.value);
    productHasMore.value = isHasMore.value;
  }
};

const previous = () => {
  products.length = 0;
  pageCount.value = pageCount.value - 1;
  if (!isSearched.value) {
    productStore.getSome(pageCount.value, true);
  } else {
    productHasMore.value = isHasMore.value;
    products.push(...paginateItems.value);
  }
};
</script>

<template>
  <section-title with-button>
    <template #icon>
      <product-icon size="28" />
    </template>
    Products
    <template #buttons>
      <basic-button
        class-name="bg-brand-400 text-grey-200"
        is-link
        link="/admin/products/new"
      >
        <plus-icon size="24" />
        Add Product
      </basic-button>
    </template>
  </section-title>

  <div class="flex justify-end py-4">
    <form @submit.prevent="search" class="flex justify-end items-center gap-2">
      <basic-input className="w-52" :value="searchQuery" @update="update" />
      <button type="submit" class="bg-brand-400 p-2 rounded-md">
        <search-icon color="text-grey-200" size="20" />
      </button>
    </form>
  </div>
  <div class="relative overflow-x-auto shadow-md rounded-lg mb-4">
    <table class="w-full text-sm text-left text-grey-500">
      <thead class="text-xs text-grey-700 uppercase bg-grey-50">
        <tr>
          <th scope="col" class="px-6 py-3">Title</th>
          <th scope="col" class="px-6 py-3">Author</th>
          <th scope="col" class="px-6 py-3">Demo Link</th>
          <th scope="col" class="px-6 py-3">Journal Link</th>
          <th scope="col" class="px-6 py-3">Video Link</th>
          <th scope="col" class="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="bg-white border-b"
          v-for="product in products"
          :key="product.id"
        >
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 w-60">
            {{ truncate(product.title, 40) }}
          </th>
          <td class="px-6 py-4">{{ product.author }}</td>
          <td class="px-6 py-4">
            {{ truncate(product.demo_link, 15) }}
          </td>
          <td class="px-6 py-4">
            {{ truncate(product.journal_link, 15) }}
          </td>
          <td class="px-6 py-4">
            {{ truncate(product.video_link, 15) }}
          </td>
          <td class="px-6 py-4 w-24">
            <router-link
              :to="`/admin/products/${product.id}`"
              class="font-medium text-blue-600 hover:underline"
            >
              Detail
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <nav class="flex items-center justify-between" aria-label="Table navigation">
    <ul class="inline-flex items-center -space-x-px">
      <li>
        <button
          @click="previous"
          class="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-grey-300 rounded-l-lg hover:bg-grey-100 hover:text-grey-700 disabled:bg-grey-400 disabled:cursor-not-allowed"
          :disabled="pageCount == 1"
        >
          <chevron-left-icon size="20" color="text-grey-700" />
        </button>
      </li>
      <li>
        <button
          @click="next"
          class="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-grey-300 rounded-r-lg hover:bg-grey-100 hover:text-grey-700 disabled:bg-grey-400 disabled:cursor-not-allowed"
          :disabled="!productHasMore"
        >
          <chevron-right-icon size="20" color="text-grey-700" />
        </button>
      </li>
    </ul>
  </nav>
</template>
