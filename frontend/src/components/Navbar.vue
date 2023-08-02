<script setup>
import MenuIcon from './icons/MenuIcon.vue';
import FadeScaleTransition from './transitions/FadeScaleTransition.vue';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { onMounted, ref, toRefs } from 'vue';

const props = defineProps({
  notTransparent: Boolean,
  responsive: Boolean,
});

const { notTransparent, responsive } = toRefs(props);
const show = ref(false);

onMounted(() => {
  window.addEventListener('scroll', transition);
});

const transition = () => {
  if (window.scrollY > 50) show.value = true;
  else show.value = false;
};
</script>

<template>
  <div
    class="fixed w-full z-20 transition duration-300"
    :class="{ 'bg-grey-100': show || notTransparent, 'bg-transparent': !show }"
  >
    <nav
      class="container mx-auto h-16 flex items-center justify-between px-4 md:p-0"
    >
      <h1
        class="text-grey-200 text-4xl font-medium"
        :class="{ 'text-grey-800': show || notTransparent }"
      >
        <slot name="brand" />
      </h1>
      <div class="block md:hidden" v-if="responsive">
        <Menu as="div" class="relative">
          <MenuButton>
            <menu-icon
              size="26"
              :color="[
                show || notTransparent ? 'text-grey-800' : 'text-grey-200',
              ]"
              clickable
            />
          </MenuButton>
          <fade-scale-transition>
            <MenuItems
              class="absolute top-full right-0 bg-white shadow-md rounded-md overflow-hidden w-32"
            >
              <slot name="responsive-menu" />
            </MenuItems>
          </fade-scale-transition>
        </Menu>
      </div>
      <div
        class="gap-4 text-grey-200 items-center"
        :class="[
          { 'text-grey-800': show || notTransparent },
          responsive ? 'hidden md:flex' : 'flex',
        ]"
      >
        <slot name="right-menu" />
      </div>
    </nav>
  </div>
</template>
