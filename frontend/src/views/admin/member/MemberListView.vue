<script setup>
import ProductIcon from '../../../components/icons/ProductIcon.vue';
import PlusIcon from '../../../components/icons/PlusIcon.vue';
import ChevronRightIcon from '../../../components/icons/ChevronRightIcon.vue';
import ChevronLeftIcon from '../../../components/icons/ChevronLeftIcon.vue';
import SearchIcon from '../../../components/icons/SearchIcon.vue';

import SectionTitle from '../../../components/admin/SectionTitle.vue';
import BasicButton from '../../../components/inputs/BasicButton.vue';
import BasicInput from '../../../components/inputs/BasicInput.vue';

import { onMounted, reactive, ref } from 'vue';

import { useMemberStore } from '../../../stores/member';

const memberStore = useMemberStore();
const members = reactive([]);

const pageCount = ref(1);
const memberHasMore = ref(true);

const searchQuery = ref('');

onMounted(() => {
  memberStore.$reset();
  memberStore.getSome('', pageCount.value, true);
});

memberStore.$subscribe((mutation, state) => {
  Object.assign(members, state.members);

  memberHasMore.value = state.hasMore;
});

const update = (payload) => {
  searchQuery.value = payload;
};

const search = () => {
  const query = searchQuery.value.trim();
    members.length = 0;
    pageCount.value = 1;
    memberStore.getSome(query, pageCount.value, true);
};

const next = () => {
  members.length = 0;
  pageCount.value = pageCount.value + 1;
  memberStore.getSome(searchQuery.value, pageCount.value, true);
};

const previous = () => {
  members.length = 0;
  pageCount.value = pageCount.value - 1;
  memberStore.getSome(searchQuery.value, pageCount.value, true);
};

const truncate = (string, n) => {
  return string?.length > n ? string.substring(0, n - 1) + '...' : string;
};
</script>

<template>
  <section-title with-button>
    <template #icon>
      <product-icon size="28" />
    </template>
    Members
    <template #buttons>
      <basic-button
        class-name="bg-brand-400 text-grey-200"
        is-link
        link="/admin/members/new"
      >
        <plus-icon size="24" />
        Add Member
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

  <div class="relative overflow-x-auto shadow-md rounded-lg my-4">
    <table class="w-full text-sm text-left text-grey-500">
      <thead class="text-xs text-grey-700 uppercase bg-grey-50">
        <tr>
          <th scope="col" class="px-6 py-3">Name</th>
          <th scope="col" class="px-6 py-3">NIP</th>
          <th scope="col" class="px-6 py-3">Email</th>
          <th scope="col" class="px-6 py-3">Status</th>
          <th scope="col" class="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr class="bg-white border-b" v-for="member in members">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 w-48">
            {{ truncate(member.name, 30) }}
          </th>
          <td class="px-6 py-4">
            {{ truncate(member.nip, 20) }}
          </td>
          <td class="px-6 py-4">
            {{ truncate(member.email, 20) }}
          </td>
          <td class="px-6 py-4">
            {{ truncate(member.status, 20) }}
          </td>
          <td class="px-6 py-4 w-24">
            <router-link
              :to="`/admin/members/${member.id}`"
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
          :disabled="pageCount == 1"
          class="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-grey-300 rounded-l-lg hover:bg-grey-100 hover:text-grey-700 disabled:bg-grey-400 disabled:cursor-not-allowed"
        >
          <chevron-left-icon size="20" color="text-grey-700" />
        </button>
      </li>
      <li>
        <button
          @click="next"
          class="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-grey-300 rounded-r-lg hover:bg-grey-100 hover:text-grey-700 disabled:bg-grey-400 disabled:cursor-not-allowed"
          :disabled="!memberHasMore"
        >
          <chevron-right-icon size="20" color="text-grey-700" />
        </button>
      </li>
    </ul>
  </nav>
</template>
