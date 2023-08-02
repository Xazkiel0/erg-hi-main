<script setup>
import PlusIcon from '../../../components/icons/PlusIcon.vue';
import InputWithLabel from '../../../components/inputs/InputWithLabel.vue';
import SectionTitle from '../../../components/admin/SectionTitle.vue';
import BasicButton from '../../../components/inputs/BasicButton.vue';
import { reactive, onMounted, ref, computed } from 'vue';
import { useHeroStore } from '../../../stores/hero';

const heroStore = useHeroStore();
const fileInput = ref(null);
const heroBackup = reactive({});
const data = reactive({
  id: { value: '' },
  'main text': {
    value: '',
    isError: false,
    rules: { required: true, min: 12 },
  },
  'alternative text': {
    value: '',
    isError: false,
    rules: { required: true, min: 8 },
  },
});

onMounted(() => {
  heroStore.getAll();
});

heroStore.$subscribe((mutation, state) => {
  Object.assign(heroBackup, state.hero);
  data.id.value = state.hero.id;
  data['main text'].value = state.hero.main_text;
  data['alternative text'].value = state.hero.alt_text;
});

const isDisabled = computed(() => {
  return data['main text'].isError || data['alternative text'].isError;
});

const isCorrect = computed(() => {
  return !data['main text'].isError && !data['alternative text'].isError;
});

const submit = () => {
  if (isCorrect.value) {
    if (data.id.value) {
      if (!fileInput.value.files.length) {
        heroStore.update(data.id.value, {
          main_text: data['main text'].value,
          alt_text: data['alternative text'].value,
        });
      } else {
        heroStore.uploadFileAndIn(
          data.id.value,
          {
            main_text: data['main text'].value,
            alt_text: data['alternative text'].value,
          },
          fileInput.value.files
        );
      }
    } else {
      if (!fileInput.value.files.length) {
        alert('Please add an image!');
      } else {
        heroStore.uploadFileAndIn(
          '',
          {
            main_text: data['main text'].value,
            alt_text: data['alternative text'].value,
          },
          fileInput.value.files
        );
      }
    }
  }
};

const reset = () => {
  data['main text'].value = heroBackup.main_text;
  data['alternative text'].value = heroBackup.alt_text;
  data.oldFile.value = heroBackup.filename;
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
    Edit Hero
  </section-title>
  <div class="bg-grey-50 rounded-md my-4 flex flex-col p-4 gap-2">
    <input-with-label label="Main Text" type="textarea" show-error-message :error-rules="data['main text'].rules"
      @update="update" @errorChecker="errorChecker" :value="data['main text'].value" />
    <input-with-label label="Alternative Text" type="textarea" show-error-message
      :error-rules="data['alternative text'].rules" @update="update" @errorChecker="errorChecker"
      :value="data['alternative text'].value" />
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
