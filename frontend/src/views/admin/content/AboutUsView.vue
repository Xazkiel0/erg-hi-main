<script setup>
import PlusIcon from '../../../components/icons/PlusIcon.vue';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon.vue';
import InputWithLabel from '../../../components/inputs/InputWithLabel.vue';
import SectionTitle from '../../../components/admin/SectionTitle.vue';
import BasicButton from '../../../components/inputs/BasicButton.vue';
import { reactive, onMounted, ref, computed } from 'vue';
import { useAboutUsStore } from '../../../stores/aboutUs';

const aboutUsStore = useAboutUsStore();
const fileInput = ref(null);
const aboutUsBackup = reactive({});
const data = reactive({
  id: { value: '' },
  text: {
    value: '',
    isError: false,
    rules: { required: true, min: 6 },
  },
  description: {
    value: '',
    isError: false,
    rules: { required: true, min: 12 },
  },
  oldFile: { value: '' },
});

onMounted(() => {
  aboutUsStore.getAll();
});

aboutUsStore.$subscribe((mutation, state) => {
  Object.assign(aboutUsBackup, state.aboutUs);
  data.id.value = state.aboutUs.id;
  data.text.value = state.aboutUs.text;
  data.description.value = state.aboutUs.description;
  data.oldFile.value = state.aboutUs.filename;
});

const isDisabled = computed(() => {
  return data.text.isError || data.description.isError;
});

const isCorrect = computed(() => {
  return !data.text.isError && !data.description.isError;
});

const submit = () => {
  if (isCorrect.value) {
    if (data.id.value) {
      if (!fileInput.value.files[0]) {
        aboutUsStore.update(data.id.value, {
          text: data.text.value,
          description: data.description.value,
          filename: data.oldFile.value,
        });
      } else {
        aboutUsStore.uploadFileAndIn(
          data.id.value,
          {
            text: data.text.value,
            description: data.description.value,
            oldFile: data.oldFile.value,
          },
          fileInput.value.files[0]
        );
      }
    } else {
      if (!fileInput.value.files[0]) {
        alert('Please add an image!');
      } else {
        aboutUsStore.uploadFileAndIn(
          '',
          {
            text: data.text.value,
            description: data.description.value,
            oldFile: data.oldFile.value,
          },
          fileInput.value.files[0]
        );
      }
    }
  }
};

const reset = () => {
  data.title.value = aboutUsBackup.title;
  data.description.value = aboutUsBackup.description;
  data.oldFile.value = aboutUsBackup.filename;
  fileInput.value.value = '';
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
    Edit About Us
    <template #buttons>
      <basic-button class-name="bg-red-500 text-grey-200">
        <arrow-left-icon size="24" />
        Back
      </basic-button>
    </template>
  </section-title>
  <div class="bg-grey-50 rounded-md my-4 flex flex-col p-4 gap-2">
    <input-with-label label="Text" type="text" show-error-message :error-rules="data.text.rules" @update="update"
      @errorChecker="errorChecker" :value="data.text.value" />
    <input-with-label label="Description" type="textarea" show-error-message :error-rules="data.description.rules"
      @update="update" @errorChecker="errorChecker" :value="data.description.value" />
    <div class="flex flex-col">
      <label for="file" class="font-medium text-base">Image</label>
      <input type="file" id="file" accept="image/png, image/jpeg" ref="fileInput" />
    </div>
    <div class="flex justify-start items-centeri gap-2">
      <basic-button class-name="bg-brand-500 text-grey-200 disabled:cursor-not-allowed disabled:bg-brand-800"
        @click="submit" :disabled="isDisabled">
        Submit
      </basic-button>
      <basic-button class-name="bg-transparent border border-brand-500 text-brand-500" @click="reset">
        Reset
      </basic-button>
    </div>
  </div>
</template>
