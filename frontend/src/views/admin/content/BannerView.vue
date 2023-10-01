<script setup>
import PlusIcon from '../../../components/icons/PlusIcon.vue';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon.vue';
import InputWithLabel from '../../../components/inputs/InputWithLabel.vue';
import SectionTitle from '../../../components/admin/SectionTitle.vue';
import BasicButton from '../../../components/inputs/BasicButton.vue';
import { reactive, onMounted, ref, computed } from 'vue';
import { useBannerStore} from '../../../stores/banner';

const bannerStore = useBannerStore();
const fileInput = ref(null);
const bannerBackup = reactive({});
const data = reactive({
  id: { value: '' },
  name: {
    value: '',
    isError: false,
    rules: { required: true },
  },
  oldFile: { value: '' },
});

onMounted(() => {
  bannerStore.getAll();
});

bannerStore.$subscribe((mutation, state) => {
  Object.assign(bannerBackup, state.banner);
  data.id.value = state.banner.id;
  data.name.value = state.banner.name;
  data.oldFile.value = state.banner.filename;
});

const isDisabled = computed(() => {
  return data.name.isError;
});

const isCorrect = computed(() => {
  return !data.name.isError;
});

const submit = () => {
  if (isCorrect.value) {
    if (data.id.value) {
      if (!fileInput.value.files[0]) {
        bannerStore.update(data.id.value, {
          name: data.name.value,
          filename: data.oldFile.value,
        });
      } else {
        bannerStore.uploadFileAndIn(
          data.id.value,
          {
            name: data.name.value,
            oldFile: data.oldFile.value,
          },
          fileInput.value.files[0]
        );
      }
    } else {
      if (!fileInput.value.files[0]) {
        alert('Please add an image!');
      } else {
        bannerStore.uploadFileAndIn(
          '',
          {
            name: data.name.value,
            oldFile: data.oldFile.value,
          },
          fileInput.value.files[0]
        );
      }
    }
  }
};

const reset = () => {
  data.name.value = bannerBackup.name;
  data.oldFile.value = bannerBackup.filename;
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
    Edit Banner 
  </section-title>
  <div class="bg-grey-50 rounded-md my-4 flex flex-col p-4 gap-2">
    <input-with-label label="Name" type="text" show-error-message :error-rules="data.name.rules"
      @update="update" @errorChecker="errorChecker" :value="data.name.value" />
    <div class="flex flex-col">
      <label for="file" class="font-medium text-base">Image</label>
      <input type="file" id="file" name="files" accept="image/png, image/jpeg" ref="fileInput" multiple />
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
