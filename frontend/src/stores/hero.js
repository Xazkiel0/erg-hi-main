import axios from 'axios';
import { defineStore } from 'pinia';

export const useHeroStore = defineStore('hero', {
  state: () => ({
    hero: {},
  }),
  actions: {
    async getAll() {
      try {
        const response = await axios.get('/hero/');
        const data = await response.data;
        if (response.status === 200) {
          this.hero = { ...data };
        }
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
    async uploadFileAndIn(id, payload, files) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      try {
        const response = await axios.postForm('/images/slides/', formData, {
          headers: {
            Authorization: `Bearer ${$cookies.get('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 201) {
          if (id) this.update(id, payload);
          else this.create(payload);
        }
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
    async create(payload) {
      try {
        const response = await axios.post(`/hero/`, payload, {
          headers: {
            Authorization: `Bearer ${$cookies.get('token')}`,
          },
        });
        if (response.status === 201) {
          window.location.reload();
        }
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
    async update(id, payload) {
      try {
        const response = await axios.put(`/hero/${id}/`, payload, {
          headers: {
            Authorization: `Bearer ${$cookies.get('token')}`,
          },
        });
        if (response.status === 202) {
          window.location.reload();
        }
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
    async deleteFile(filename) {
      try {
        await axios.delete(`/images/${filename}/`, {
          headers: {
            Authorization: `Bearer ${$cookies.get('token')}`,
          },
        });
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
  },
});
