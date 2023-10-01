import axios from 'axios';
import { defineStore } from 'pinia';

export const useBannerStore = defineStore('banner', {
  state: () => ({
    banner: {},
  }),
  actions: {
    async getAll() {
      try {
        const response = await axios.get('/banner/');
        const data = await response.data;
        if (response.status === 200) {
          this.banner = { ...data };
        }
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
    async uploadFileAndIn(id, payload, file) {
      try {
        const response = await axios.post(
          '/images/',
          { file },
          {
            headers: {
              Authorization: `Bearer ${$cookies.get('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        const data = await response.data;
        if (response.status === 201) {
          payload.filename = data.filename;
          await this.deleteFile(payload.oldFile);
          if (id) this.update(id, payload);
          else this.create(payload);
        }
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
    async create(payload) {
      try {
        const response = await axios.post(`/banner/`, payload, {
          headers: {
            Authorization: `Bearer ${$cookies.get('token')}`,
          },
        });
        if (response.status === 201) {
          window.location.reload();
        }
      } catch (err) {
        if (payload.filename) {
          this.deleteFile(payload.filename);
        }
        console.error('[ERROR]: ' + err);
      }
    },
    async update(id, payload) {
      try {
        const response = await axios.put(`/banner/${id}/`, payload, {
          headers: {
            Authorization: `Bearer ${$cookies.get('token')}`,
          },
        });
        if (response.status === 202) {
          window.location.reload();
        }
      } catch (err) {
        if (payload.filename) {
          this.deleteFile(payload.filename);
        }
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
