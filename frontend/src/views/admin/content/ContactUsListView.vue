<script setup>
import ProductIcon from '../../../components/icons/ProductIcon.vue';
import PlusIcon from '../../../components/icons/PlusIcon.vue';
import SectionTitle from '../../../components/admin/SectionTitle.vue';
import BasicButton from '../../../components/inputs/BasicButton.vue';

import { useContactUsStore } from '../../../stores/contactUs';
import { computed, onMounted, reactive, ref } from 'vue';

import { env} from '../../../utils'
import ImageDeta from '../../../components/ImageDeta.vue';

const contactUsStore = useContactUsStore();
const contactUses = reactive({});
const baseUrl = ref(env.api_url);

onMounted(async() => {
  contactUsStore.getAll();
});

contactUsStore.$subscribe((mutation, state) => {
  Object.assign(contactUses, state.contactUs);
});

const deleteContact = (id) => {
  if (confirm('Are you sure?')) {
    contactUsStore.delete(id);
  }
};
</script>

<template>
  <section-title with-button>
    <template #icon>
      <product-icon size="28" />
    </template>
    Contact Us
    <template #buttons>
      <basic-button class-name="bg-brand-400 text-grey-200" is-link link="/admin/contact-us/new">
        <plus-icon size="24" />
        Add Link
      </basic-button>
    </template>
  </section-title>

  <div class="relative overflow-x-auto shadow-md rounded-lg my-4">
    <table class="w-full text-sm text-left text-grey-500">
      <thead class="text-xs text-grey-700 uppercase bg-grey-50">
        <tr>
          <th scope="col" class="px-6 py-3">Name</th>
          <th scope="col" class="px-6 py-3">Image</th>
          <th scope="col" class="px-6 py-3">Link</th>
          <th scope="col" class="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr class="bg-white border-b" v-for="contact_us in contactUses" :key="contact_us.id">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900">
            {{ contact_us.name }}
          </th>
          <td class="px-6 py-4">
            <image-deta :filename="contact_us.filename" :alt-prop="contact_us.name" class-prop="w-12 h-12 object-cover rounded-md"/>
          </td>
          <td class="px-6 py-4">
            {{ contact_us.link }}
          </td>
          <td class="px-6 py-4 w-24 flex gap-1 flex-col items-center">
            <router-link :to="`/admin/contact-us/${contact_us.id}/edit`"
              class="font-medium text-blue-600 hover:underline">
              Edit
            </router-link>
            <button @click="deleteContact(contact_us.id)" class="font-medium text-red-600 hover:underline">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
