<script setup>
import PlusIcon from '../../components/icons/PlusIcon.vue';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon.vue';
import InputWithLabel from '../../components/inputs/InputWithLabel.vue';
import SectionTitle from '../../components/admin/SectionTitle.vue';
import BasicButton from '../../components/inputs/BasicButton.vue';

import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, reactive, ref } from 'vue';

import { useProductStore } from '../../stores/product';

const router = useRouter();
const route = useRoute();
const productStore = useProductStore();

const isSubmited = ref(false);
const fileInput = ref(null);
const productBackup = reactive({});

const { productId } = route.params;

const data = reactive({
  title: { value: '', isError: false, rules: { required: true, min: 8 } },
  author: { value: '', isError: false, rules: { required: true } },
  'demo link': { value: '', isError: false, rules: { required: true } },
  'journal link': { value: '', isError: false, rules: { required: true } },
  'video link': { value: '', isError: false, rules: { required: true } },
  description: {
    value: '',
    isError: false,
    rules: { required: true, min: 12 },
  },
  oldFile: { value: '' },
});

onMounted(() => {
  if (productId) {
    isSubmited.value = true;
    productStore.getOneById({ id: productId });
  }
});

productStore.$subscribe((mutation, state) => {
  if (productId) {
    Object.assign(productBackup, state.product);
    data.title.value = state.product.title;
    data.author.value = state.product.author;
    data['demo link'].value = state.product.demo_link;
    data['journal link'].value = state.product.journal_link;
    data['video link'].value = state.product.video_link;
    data.description.value = state.product.description;
    data.oldFile.value = state.product.filename;
  }
});

const isDisabled = computed(() => {
  if (!productId) {
    return (
      isSubmited.value &&
      (data.title.isError ||
        data.author.isError ||
        data['demo link'].isError ||
        data['journal link'].isError ||
        data['video link'].isError ||
        data.description.isError)
    );
  }
});

const isCorrect = computed(() => {
  return (
    !data.title.isError &&
    !data.author.isError &&
    !data['demo link'].isError &&
    !data['journal link'].isError &&
    !data['video link'].isError &&
    !data.description.isError
  );
});

const submit = () => {
  isSubmited.value = true;
  if (isCorrect.value) {
    if (!productId) {
      if (!fileInput.value.files[0]) {
        alert('Please add an image!');
      } else {
        productStore.uploadFileAndCreate(
          {
            title: data.title.value,
            author: data.author.value,
            demo_link: data['demo link'].value,
            journal_link: data['journal link'].value,
            video_link: data['video link'].value,
            description: data.description.value,
          },
          fileInput.value.files[0]
        );
      }
    } else {
      if (fileInput.value.files[0]) {
        productStore.uploadFileAndUpdate(
          productId,
          {
            title: data.title.value,
            author: data.author.value,
            demo_link: data['demo link'].value,
            journal_link: data['journal link'].value,
            video_link: data['video link'].value,
            description: data.description.value,
            oldFile: data.oldFile.value,
          },
          fileInput.value.files[0]
        );
      } else {
        productStore.update(productId, {
          title: data.title.value,
          author: data.author.value,
          demo_link: data['demo link'].value,
          journal_link: data['journal link'].value,
          video_link: data['video link'].value,
          description: data.description.value,
          filename: data.oldFile.value,
        });
      }
    }
  }
};

const reset = () => {
  if (!productId) {
    data.title.value = '';
    data.author.value = '';
    data['demo link'].value = '';
    data['journal link'].value = '';
    data['video link'].value = '';
    data.description.value = '';
  } else {
    data.title.value = productBackup.title;
    data.author.value = productBackup.author;
    data['demo link'].value = productBackup.demo_link;
    data['journal link'].value = productBackup.journal_link;
    data['video link'].value = productBackup.video_link;
    data.description.value = productBackup.description;
    data.oldFile.value = productBackup.filename;
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
    {{ productId ? 'Edit' : 'Add' }} Products
    <template #buttons>
      <basic-button class-name="bg-red-500 text-grey-200" @click="back">
        <arrow-left-icon size="24" />
        Back
      </basic-button>
    </template>
  </section-title>
  <div class="bg-grey-50 rounded-md my-8 flex flex-col p-4 gap-2">
    <input-with-label label="Title" type="text" :show-error-message="isSubmited" :error-rules="data.title.rules"
      @update="update" @errorChecker="errorChecker" :value="data.title.value" />
    <input-with-label label="Author" type="text" :show-error-message="isSubmited" :error-rules="data.author.rules"
      @update="update" @errorChecker="errorChecker" :value="data.author.value" />
    <input-with-label label="Demo Link" type="text" :show-error-message="isSubmited"
      :error-rules="data['demo link'].rules" @update="update" @errorChecker="errorChecker"
      :value="data['demo link'].value" />
    <input-with-label label="Journal Link" type="text" :show-error-message="isSubmited"
      :error-rules="data['journal link'].rules" @update="update" @errorChecker="errorChecker"
      :value="data['journal link'].value" />
    <input-with-label label="Video Link" type="text" :show-error-message="isSubmited"
      :error-rules="data['video link'].rules" @update="update" @errorChecker="errorChecker"
      :value="data['video link'].value" />
    <input-with-label label="Description" type="textarea" :show-error-message="isSubmited"
      :error-rules="data.description.rules" @update="update" @errorChecker="errorChecker"
      :value="data.description.value" />
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
