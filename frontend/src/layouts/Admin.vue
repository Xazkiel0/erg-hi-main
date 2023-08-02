<script setup>
import LogoutIcon from '../components/icons/LogoutIcon.vue';
import ProductIcon from '../components/icons/ProductIcon.vue';
import AccountIcon from '../components/icons/AccountIcon.vue';
import MenuIcon from '../components/icons/MenuIcon.vue';
import AdminNavbar from '../components/admin/Navbar.vue';
import AdminSidenav from '../components/admin/Sidenav.vue';

import { ref } from 'vue';

import { useUserStore } from '../stores/user';

const userStore = useUserStore();

const open = ref(false);

const toggleSidenav = () => {
  open.value = !open.value;
};

const logout = () => {
  userStore.logout();
};
</script>

<template>
  <div class="min-h-screen w-full flex bg-grey-300 p-2">
    <admin-sidenav :open="open">
      <template #menus>
        <router-link
          to="/admin/products"
          class="flex gap-4 cursor-pointer group"
        >
          <product-icon
            size="24"
            class="transition duration-200 group-hover:text-brand-600"
          />
          <span
            class="text-md text-grey-900 font-medium transition duration-200 group-hover:text-brand-600"
            >Products</span
          >
        </router-link>
        <router-link
          to="/admin/hero"
          class="flex gap-4 cursor-pointer group"
        >
          <product-icon
            size="24"
            class="transition duration-200 group-hover:text-brand-600"
          />
          <span
            class="text-md text-grey-900 font-medium transition duration-200 group-hover:text-brand-600"
            >Hero</span
          >
        </router-link>
        <router-link
          to="/admin/about-us"
          class="flex gap-4 cursor-pointer group"
        >
          <product-icon
            size="24"
            class="transition duration-200 group-hover:text-brand-600"
          />
          <span
            class="text-md text-grey-900 font-medium transition duration-200 group-hover:text-brand-600"
            >About Us</span
          >
        </router-link>
        <router-link
          to="/admin/contact-us"
          class="flex gap-4 cursor-pointer group"
        >
          <product-icon
            size="24"
            class="transition duration-200 group-hover:text-brand-600"
          />
          <span
            class="text-md text-grey-900 font-medium transition duration-200 group-hover:text-brand-600"
            >Contact Us</span
          >
        </router-link>
      </template>
      <template #bottom-menu>
        <div
          class="h-10 w-full flex p-6 items-center bg-brand-600 text-grey-200 gap-2 cursor-pointer transition duration-200 hover:bg-brand-800"
          @click="logout"
        >
          <logout-icon size="20" />
          <span class="text-md font-medium">Logout</span>
        </div>
      </template>
    </admin-sidenav>
    <div class="w-full overflow-hidden">
      <admin-navbar>
        <template #left>
          <menu-icon size="26" clickable @click="toggleSidenav" />
        </template>
        <template #right>
          <div class="flex items-center gap-2">
            <account-icon size="26" />
            <span>Admin</span>
          </div>
          <logout-icon size="24" clickable @click="logout" />
        </template>
      </admin-navbar>
      <div class="m-4">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
