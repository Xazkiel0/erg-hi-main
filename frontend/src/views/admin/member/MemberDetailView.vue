<script setup>
import ProductIcon from '../../../components/icons/ProductIcon.vue';
import PencilIcon from '../../../components/icons/PencilIcon.vue';
import TrashIcon from '../../../components/icons/TrashIcon.vue';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon.vue';
import SectionTitle from '../../../components/admin/SectionTitle.vue';
import LinkWithLabel from '../../../components/LinkWithLabel.vue';
import BasicButton from '../../../components/inputs/BasicButton.vue';

import { onMounted, reactive, ref } from 'vue';

import { useMemberStore } from '../../../stores/member';
import { useRoute } from 'vue-router';
import { get_image } from "../../../utils";

const memberStore = useMemberStore();
const route = useRoute();
const member = reactive({});
const img = ref()

const { memberId } = route.params;

onMounted(async () => {
  memberStore.getOneById({ id: memberId });
});

memberStore.$subscribe(async (mutation, state) => {
  Object.assign(member, state.member);
  img.value = URL.createObjectURL(await get_image(member.filename))
});

const deleteMember = () => {
  if (confirm('Are you sure?')) {
    memberStore.delete(memberId);
  }
};
</script>

<template>
  <section-title with-button>
    <template #icon>
      <product-icon size="28" />
    </template>
    Detail Member 
    <template #buttons>
      <basic-button
        class-name="bg-red-500 text-grey-200"
        is-link
        link="/admin/members"
      >
        <arrow-left-icon size="24" />
        Back
      </basic-button>
      <basic-button
        class-name="bg-yellow-900 text-grey-200"
        is-link
        :link="`/admin/members/${member.id}/edit`"
      >
        <pencil-icon size="24" />
        Edit
      </basic-button>
      <basic-button
        class-name="bg-red-700 text-grey-200"
        @click="deleteMember"
      >
        <trash-icon size="24" />
        Delete
      </basic-button>
    </template>
  </section-title>
  <div
    class="bg-grey-50 rounded-md my-8 flex flex-col gap-6 py-6 px-6 md:flex-row lg:py-12"
  >
    <div class="basis-1/2 flex justify-center">
      <img
        v-if="member"
        :alt="member.name"
        :src="img"
        class="w-96 h-96 object-cover rounded-md"
      />
      <div v-else class="w-96 h-96 bg-grey-500 rounded-md"></div>
    </div>
    <div class="basis-1/2 flex flex-col items-start">
      <div class="mt-5 flex flex-col gap-2">
        <div class="text-grey-800">
          <span>Name</span>:
          <span class="font-medium">{{ member.name }}</span>
        </div>
        <div class="text-grey-800">
          <span>NIP</span>:
          <span class="font-medium">{{ member.nip }}</span>
        </div>
        <div class="text-grey-800">
          <span>email</span>:
          <span class="font-medium">{{ member.email}}</span>
        </div>
        <div class="text-grey-800">
          <span>Status</span>:
          <span class="font-medium">{{ member.status}}</span>
        </div>
        <link-with-label label="Google Scholar" :link="member.google_scholar">
          {{ member.google_scholar }}
        </link-with-label>
        <link-with-label label="Website Profile" :link="member.webiste_profile">
          {{ member.website_profile }}
        </link-with-label>
      </div>
    </div>
  </div>
</template>
