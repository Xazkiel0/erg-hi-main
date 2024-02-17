<script setup>
import ImageDeta from './ImageDeta.vue';
import { toRefs } from 'vue';

const props = defineProps({
  member: Object,
});

const { member } = toRefs(props);
</script>

<template>
  <div class="bg-gray-50 w-4/5 rounded-md p-8 flex flex-col gap-4 mx-auto md:w-full md:flex-row md:gap-2">
    <div class="basis-1/4 flex justify-center">
      <image-deta :filename="member.filename" :alt-prop="member.name" class-prop="w-40 h-40 object-cover rounded-md" />
    </div>
    <div class="basis-3/4 flex items-center justify-center md:justify-start">
      <table>
        <tr class="text-grey-800">
          <td>Nama</td>
          <td class="font-medium">: {{ member.name }}</td>
        </tr>
        <tr class="text-grey-800">
          <td>NIP</td>
          <td class="font-medium">: {{ member.nip }}</td>
        </tr>
        <tr class="text-grey-800">
          <td>Google Scholar</td>
          <td>
            :
            <a :href="member.google_scholar" target="_blank" class="text-blue-700" v-if="member.google_scholar">visit
              here</a>
            <span v-else>-</span>
          </td>
        </tr>
        <tr class="text-grey-800">
          <td>Website Profile</td>
          <td>
            :
            <a :href="member.website_profile" target="_blank" class="text-blue-700" v-if="member.website_profile">visit
              here</a>
            <span v-else>-</span>
          </td>
        </tr>
        <tr class="text-grey-800">
          <td>Email</td>
          <td class="font-medium">: {{ member.email }}</td>
        </tr>
        <tr class="text-grey-800">
          <td>Status</td>
          <td class="font-medium">: {{ member.status }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
