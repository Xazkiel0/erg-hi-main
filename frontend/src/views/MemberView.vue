<script setup>
import MemberCard from '../components/MemberCard.vue';
import { onMounted, reactive } from 'vue';
import { useMemberStore } from '../stores/member';
import MemberCardVue from '../components/MemberCard.vue';

const memberStore = useMemberStore();
const members = reactive({});

onMounted(() => {
  memberStore.getAll();
});

memberStore.$subscribe((mutation, state) => {
  Object.assign(members, state.members);
});
</script>

<template>
  <div class="mt-24 mx-auto container w-full flex flex-col items-center gap-8">
    <h1 class="text-brand-800 text-2xl font-medium">
      Peneliti di RG Health Informatics
    </h1>
    <div class="flex flex-col w-full gap-4">
      <member-card v-for="member in members" :member="member" />
    </div>
  </div>
</template>
