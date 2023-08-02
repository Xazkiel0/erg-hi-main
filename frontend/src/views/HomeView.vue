<script setup>
import SearchIcon from '../components/icons/SearchIcon.vue';
import Hero from '../components/Hero.vue';
import BasicInput from '../components/inputs/BasicInput.vue';
import ProductItem from '../components/ProductItem.vue';

import { ref, onMounted, reactive, computed } from 'vue';
import { useProductStore } from '../stores/product';
import { useHeroStore } from '../stores/hero';
import { useAboutUsStore } from '../stores/aboutUs';
import { useContactUsStore } from '../stores/contactUs';

import { env, list_images } from '../utils'

const productStore = useProductStore();
const heroStore = useHeroStore();
const aboutUsStore = useAboutUsStore();
const contactUsStore = useContactUsStore();

const baseUrl = ref(env.api_url);
const searchQuery = ref('');
const pageCount = ref(1);
const productHasMore = ref(false);
const isSearched = ref(false);
const img = ref('')

const products = reactive([]);
const productsBackup = reactive([]);
const tfIdf = reactive({});
const hero = reactive({});
const aboutUs = reactive({});
const contactUses = reactive([]);

import { get_image } from "../utils";
import ImageDeta from '../components/ImageDeta.vue';

onMounted(async () => {
  aboutUsStore.getAll();
  heroStore.getAll();
  productStore.getSome(pageCount.value, true);
  contactUsStore.getAll();
  img.value = URL.createObjectURL(await get_image(hero.filename))
});

contactUsStore.$subscribe((mutation, state) => {
  Object.assign(contactUses, state.contactUs);
});

heroStore.$subscribe((mutation, state) => {
  Object.assign(hero, state.hero);
});

aboutUsStore.$subscribe((mutation, state) => {
  Object.assign(aboutUs, state.aboutUs);
});

productStore.$subscribe((mutation, state) => {
  Object.assign(products, state.products);
  Object.assign(tfIdf, state.tdidf);

  productHasMore.value = state.hasMore;

  if (isSearched.value) {
    productHasMore.value = products.length === 3 ? false : true;
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
    products.length = 0;
    productStore.getSome(1, true);
    productStore.getTfIdf({ query });
  } else {
    isSearched.value = true;
    pageCount.value = 1;
    productStore.getAll();
    productStore.getTfIdf({ query });
  }
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

const seeMore = () => {
  pageCount.value = pageCount.value + 1;
  if (!isSearched.value) {
    productStore.getSome(pageCount.value);
  } else {
    products.push(...paginateItems.value);
    productHasMore.value = isHasMore.value;
  }
};


</script>

<template>
  <div>
    <hero
      :image="img"
    >
      <h1
        class="text-grey-100 text-4xl md:text-5xl font-medium leading-[3.5rem] md:leading-[4rem]"
      >
        {{ hero.main_text }}
      </h1>
      <span class="text-grey-50 font-light">
        {{ hero.alt_text }}
      </span>
    </hero>
    <main class="mx-auto flex flex-col gap-8">
      <div id="products" class="container mx-auto w-full">
        <div class="w-full justify-center items-center flex flex-col p-8">
          <h1 class="text-3xl text-brand-900 font-semibold">Our Products</h1>
          <span class="text-brand-800">
            We only make good product with international standards. You can find it below.
          </span>
        </div>
        <div
          id="products"
          class="flex flex-col gap-8 justify-center items-center pb-4 px-4 md:px-0"
        >
          <div class="w-full flex justify-end items-center gap-2">
            <form
              @submit.prevent="search"
              class="flex justify-end items-center gap-2"
            >
              <basic-input
                className="w-52"
                :value="searchQuery"
                @update="update"
              />
              <button type="submit" class="bg-brand-400 p-2 rounded-md">
                <search-icon color="text-grey-200" size="20" />
              </button>
            </form>
          </div>
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
            <product-item
              v-for="product in products"
              :key="product.id"
              :product-id="product.id"
              :image="product.filename"
            >
              {{ product.title }}
            </product-item>
          </div>
          <button
            @click="seeMore"
            v-if="productHasMore"
            class="bg-brand-200 rounded-md py-1 px-3 text-lg text-grey-900"
          >
            See More
          </button>
        </div>
      </div>
      <div
        id="about"
        class="w-full justify-center items-center flex flex-col p-8 bg-grey-50 gap-8"
      >
        <h1 class="text-3xl text-brand-900 font-semibold">About Us</h1>
        <div
          class="flex flex-col gap-4 items-center md:items-stretch md:gap-0 md:flex-row justify-between w-full"
        >
          <div class="basis-1 md:basis-1/2 flex justify-center w-full">
            <image-deta :filename="aboutUs.filename" alt-prop="about" class-prop="w-96 h-64 object-cover rounded-md"/>
          </div>
          <div class="basis-1 w-[80%] md:w-full md:basis-1/2 flex flex-col">
            <div class="flex gap-4 flex-col md:grow">
              <h2 class="text-brand-800 text-2xl font-medium">
                {{ aboutUs.text }}
              </h2>
              <p>
                {{ aboutUs.description }}
              </p>
            </div>
            <div class="flex gap-2 items-center">
              <span>Contact us by: </span>
              <a
                v-for="contactUs in contactUses"
                target="_blank"
                :href="contactUs.link"
                :key="contactUs.id"
              >
              <image-deta :filename="contactUs.filename" :alt-prop="contactUs.name" class-prop="w-8 h-8 object-cover rounded-md"/>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
