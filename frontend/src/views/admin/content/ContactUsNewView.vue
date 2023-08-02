<script setup>
import PlusIcon from '../../../components/icons/PlusIcon.vue';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon.vue';
import InputWithLabel from '../../../components/inputs/InputWithLabel.vue';
import SectionTitle from '../../../components/admin/SectionTitle.vue';
import BasicButton from '../../../components/inputs/BasicButton.vue';
import { reactive, ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useContactUsStore } from '../../../stores/contactUs';

const router = useRouter();
const route = useRoute();
const contactUsStore = useContactUsStore();

const { contactId } = route.params;
const isSubmited = ref(false);
const fileInput = ref(null);
const contactBackup = reactive({});
const data = reactive({
  name: { value: '', isError: false, rules: { required: true } },
  link: { value: '', isError: false, rules: { required: true } },
  oldFile: { value: '' },
});

onMounted(() => {
  if (contactId) {
    contactUsStore.getOneById({ id: contactId });
  }
});

contactUsStore.$subscribe((mutation, state) => {
  if (contactId) {
    isSubmited.value = true;
    Object.assign(contactBackup, state.contact);
    data.name.value = state.contact.name;
    data.link.value = state.contact.link;
    data.oldFile.value = state.contact.filename;
  }
});

const isCorrect = computed(() => {
  return !data.name.isError && !data.link.isError;
});

const submit = () => {
  isSubmited.value = true;
  if (isCorrect.value) {
    if (!contactId) {
      if (!fileInput.value.files[0]) {
        alert('Please add an image!');
      } else {
        contactUsStore.uploadFileAndCreate(
          {
            name: data.name.value,
            link: data.link.value,
          },
          fileInput.value.files[0]
        );
      }
    } else {
      if (fileInput.value.files[0]) {
        contactUsStore.uploadFileAndUpdate(
          contactId,
          {
            name: data.name.value,
            link: data.link.value,
            oldFile: data.oldFile.value,
          },
          fileInput.value.files[0]
        );
      } else {
        contactUsStore.update(contactId, {
          name: data.name.value,
          link: data.link.value,
          filename: data.oldFile.value,
        });
      }
    }
  }
};

const back = () => {
  router.go(-1);
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
</script>

<template>
  <section-title with-button>
    <template #icon>
      <plus-icon size="28" />
    </template>
    {{ false ? 'Edit' : 'Add' }} Link
    <template #buttons>
      <basic-button class-name="bg-red-500 text-grey-200" @click="back">
        <arrow-left-icon size="24" />
        Back
      </basic-button>
    </template>
  </section-title>
  <div class="bg-grey-50 rounded-md my-4 flex flex-col p-4 gap-2">
    <input-with-label label="Name" type="text" :show-error-message="isSubmited" :error-rules="data.name.rules"
      @update="update" @errorChecker="errorChecker" :value="data.name.value" />
    <input-with-label label="Link" type="text" :show-error-message="isSubmited" :error-rules="data.link.rules"
      @update="update" @errorChecker="errorChecker" :value="data.link.value" />
    <div class="flex flex-col">
      <label for="file" class="font-medium text-base">Image</label>
      <input type="file" id="file" accept="image/png, image/jpeg" ref="fileInput" />
    </div>
    <div class="flex justify-start items-centeri gap-2">
      <basic-button class-name="bg-brand-500 text-grey-200 disabled:cursor-not-allowed disabled:bg-brand-800"
        @click="submit">
        Submit
      </basic-button>
      <basic-button class-name="bg-transparent border border-brand-500 text-brand-500">
        Reset
      </basic-button>
    </div>
  </div>
</template>
