<script setup>
import Navbar from '../components/Navbar.vue';
import Foot from '../components/Foot.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const currentRoute = computed(() => {
  return route.name;
});
</script>

<template>
  <div class="flex flex-col min-h-[100vh]">
    <navbar :not-transparent="currentRoute != 'Home'" responsive>
      <template #brand>
        <router-link to="/">
          <span class="text-brand-accent-400">E</span>RG - HI
        </router-link>
      </template>
      <template #responsive-menu>
        <MenuItem class="py-1 px-3 flex hover:bg-grey-400">
        <a href="/#products" class="flex items-center gap-1">
          <span class="text-grey-900">Our Products</span>
        </a>
        </MenuItem>
        <MenuItem class="py-1 px-3 flex hover:bg-grey-200">
        <a href="/#about" class="flex items-center gap-1">
          <span class="text-grey-900">About Us</span>
        </a>
        </MenuItem>
        <MenuItem class="py-1 px-3 flex hover:bg-grey-200">
        <router-link to="/member" class="flex items-center gap-1">
          <span class="text-grey-900">Our Member</span>
        </router-link>
        </MenuItem>
      </template>
      <template #right-menu>
        <a href="/#products">Our Products</a>
        <a href="/#about">About Us</a>
        <router-link to="/member">Our Members</router-link>
      </template>
    </navbar>
    <div class="grow mb-16 mx-auto w-full">
      <router-view></router-view>
    </div>
    <foot>
      <span class="hidden md:block text-brand-accent-100 text-sm">
        RG Health Informatics Politeknik Elektronika Negeri Surabaya
      </span>
      <span class="text-brand-accent-100"> &copy; {{ new Date().getFullYear() }} ERG - HI </span>
    </foot>
  </div>
</template>

<style scoped></style>
