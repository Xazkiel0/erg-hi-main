import axios from 'axios';
import { defineStore } from 'pinia';

export const useSlideStore = defineStore('slides', {
  state: () => ({
    slides: [],
  }),
  actions: {
    async getAll() {
      try {
        const response = await axios.get('/images/slides/');
        this.slides = [...response.data]
      } catch (err) {
      }
    },
  },
});
