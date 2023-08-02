<template>
    <img :src="img" :alt="altProp" :class="classProp" :style="style"/>
</template>
  
<script setup>
import { onMounted, ref } from 'vue';
import { get_image } from '../utils';

const { filename, altProp, classProp, style } = defineProps({
    filename: String,
    altProp: String,
    classProp: String,
    style: String,
});

const img = ref('');

onMounted(async () => {
    await tryLoadImage();
})

async function tryLoadImage() {
    try{
        img.value = URL.createObjectURL(await get_image(filename));
    }catch(e) {
        console.warn("ImageDeta: could not load image", filename);
    }
}

</script>