<script setup>
import PlusIcon from '../../../components/icons/PlusIcon.vue';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon.vue';
import InputWithLabel from '../../../components/inputs/InputWithLabel.vue';
import SectionTitle from '../../../components/admin/SectionTitle.vue';
import BasicButton from '../../../components/inputs/BasicButton.vue';

import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, reactive, ref } from 'vue';

import { useMemberStore } from '../../../stores/member';

const router = useRouter();
const route = useRoute();
const memberStore = useMemberStore();

const isSubmited = ref(false);
const fileInput = ref(null);
const memberBackup = reactive({});

const { memberId } = route.params;

const data = reactive({
  name: { value: '', isError: false, rules: { required: true } },
  nip: { value: '', isError: false, rules: { required: true } },
  email: { value: '', isError: false, rules: { required: true } },
  'google scholar': { value: '', isError: false, rules: { required: true } },
  'website profile': { value: '', isError: false, rules: { required: false } },
  status: { value: '', isError: false, rules: { required: true } },
  oldFile: { value: '' },
});

onMounted(() => {
  if (memberId) {
    isSubmited.value = true;
    memberStore.getOneById({ id: memberId });
  }
});

memberStore.$subscribe((mutation, state) => {
  if (memberId) {
    Object.assign(memberBackup, state.member);
    data.name.value = state.member.name;
    data.nip.value = state.member.nip;
    data.email.value = state.member.email;
    data['google scholar'].value = state.member.google_scholar;
    data['website profile'].value = state.member.website_profile ?? '';
    data.status.value = state.member.status;
    data.oldFile.value = state.member.filename;
  }
});

const isDisabled = computed(() => {
  if (!memberId) {
    return (
      isSubmited.value &&
      (data.name.isError ||
        data.nip.isError ||
        data.email.isError ||
        data['google scholar'].isError ||
        data['website profile'].isError ||
        data.status.isError)
    );
  }
});

const isCorrect = computed(() => {
  return (
    !data.name.isError &&
    !data.nip.isError &&
    !data.email.isError &&
    !data['google scholar'].isError &&
    !data['website profile'].isError &&
    !data.status.isError
  );
});

const submit = () => {
  isSubmited.value = true;
  if (isCorrect.value) {
    if (!memberId) {
      if (!fileInput.value.files[0]) {
        alert('Please add an image!');
      } else {
        memberStore.uploadFileAndCreate(
          {
            name: data.name.value,
            nip: data.nip.value,
            email: data.email.value,
            google_scholar: data['google scholar'].value,
            website_profile: data['website profile'].value,
            status: data.status.value,
          },
          fileInput.value.files[0]
        );
      }
    } else {
      if (fileInput.value.files[0]) {
        memberStore.uploadFileAndUpdate(
          memberId,
          {
            name: data.name.value,
            nip: data.nip.value,
            email: data.email.value,
            google_scholar: data['google scholar'].value,
            website_profile: data['website profile'].value,
            status: data.status.value,
            oldFile: data.oldFile.value,
          },
          fileInput.value.files[0]
        );
      } else {
        memberStore.update(memberId, {
          name: data.name.value,
          nip: data.nip.value,
          email: data.email.value,
          google_scholar: data['google scholar'].value,
          website_profile: data['website profile'].value,
          status: data.status.value,
          filename: data.oldFile.value,
        });
      }
    }
  }
};

const reset = () => {
  if (!memberId) {
    data.name.value = '';
    data.nip.value = '';
    data.email.value = '';
    data['google scolar'].value = '';
    data['website profile'].value = '';
    data.status.value = '';
    fileInput.value.value = '';
  } else {
    data.name.value = memberBackup.name;
    data.nip.value = memberBackup.nip;
    data.email.value = memberBackup.email;
    data['google scholar'].value = memberBackup.google_scholar;
    data['website profile'].value = memberBackup.website_profile;
    data.status.value = memberBackup.status;
    data.oldFile.value = memberBackup.filename;
    fileInput.value.value = '';
  }
};

const update = (payload) => {
  Object.keys(payload).forEach((payloadKey) => {
    Object.keys(data).forEach((key) => {
      if (key == payloadKey) {
        data[key].value = payload[key].value;
      }
    });
  });
};

const errorChecker = (payload) => {
  Object.keys(payload).forEach((payloadKey) => {
    Object.keys(data).forEach((key) => {
      if (key == payloadKey) {
        data[key].isError = payload[key].isError;
      }
    });
  });
};

const back = () => {
  router.go(-1);
};
</script>

<template>
  <section-title with-button>
    <template #icon>
      <plus-icon size="28" />
    </template>
    {{ memberId ? 'Edit' : 'Add' }} Member
    <template #buttons>
      <basic-button class-name="bg-red-500 text-grey-200" @click="back">
        <arrow-left-icon size="24" />
        Back
      </basic-button>
    </template>
  </section-title>
  <div class="bg-grey-50 rounded-md my-8 flex flex-col p-4 gap-2">
    <input-with-label
      label="Name"
      type="text"
      :show-error-message="isSubmited"
      :error-rules="data.name.rules"
      @update="update"
      @errorChecker="errorChecker"
      :value="data.name.value"
    />
    <input-with-label
      label="NIP"
      type="text"
      :show-error-message="isSubmited"
      :error-rules="data.nip.rules"
      @update="update"
      @errorChecker="errorChecker"
      :value="data.nip.value"
    />
    <input-with-label
      label="Email"
      type="email"
      :show-error-message="isSubmited"
      :error-rules="data.email.rules"
      @update="update"
      @errorChecker="errorChecker"
      :value="data.email.value"
    />
    <input-with-label
      label="Google Scholar"
      type="text"
      :show-error-message="isSubmited"
      :error-rules="data['google scholar'].rules"
      @update="update"
      @errorChecker="errorChecker"
      :value="data['google scholar'].value"
    />
    <input-with-label
      label="Website Profile"
      type="text"
      :show-error-message="isSubmited"
      :error-rules="data['website profile'].rules"
      @update="update"
      @errorChecker="errorChecker"
      :value="data['website profile'].value"
    />
    <input-with-label
      label="Status"
      type="text"
      :show-error-message="isSubmited"
      :error-rules="data.status.rules"
      @update="update"
      @errorChecker="errorChecker"
      :value="data.status.value"
    />
    <div class="flex flex-col">
      <label for="file" class="font-medium text-base">Image</label>
      <input
        type="file"
        id="file"
        accept="image/png, image/jpeg"
        ref="fileInput"
      />
    </div>
    <div class="flex justify-start items-centeri gap-2">
      <basic-button
        class-name="bg-brand-500 text-grey-200 disabled:cursor-not-allowed disabled:bg-brand-800"
        @click="submit"
        :disabled="isDisabled"
      >
        Submit
      </basic-button>
      <basic-button
        class-name="bg-transparent border border-brand-500 text-brand-500"
        @click="reset"
      >
        Reset
      </basic-button>
    </div>
  </div>
</template>
